# 🌊 DigitalOcean Ekonomik Kurulum Rehberi

## 💰 Maliyet Optimizasyonu

### En Ucuz Seçenek: Tek Droplet ($6/ay)
- **Droplet:** Basic - 1GB RAM, 1 vCPU, 25GB SSD
- **İşletim Sistemi:** Ubuntu 22.04 LTS
- **Toplam Maliyet:** $6/ay (domain hariç)

## 🚀 Adım Adım Kurulum

### 1. DigitalOcean Droplet Oluştur

1. **DigitalOcean'a giriş yap** → Create → Droplets
2. **Ayarlar:**
   - **Image:** Ubuntu 22.04 (LTS) x64
   - **Plan:** Basic - $6/mo (1GB / 1 CPU)
   - **Datacenter:** Frankfurt (Türkiye'ye en yakın)
   - **Authentication:** SSH Key (güvenli) veya Password
   - **Hostname:** project-vizyon-server

### 2. Sunucuya Bağlan

```bash
# SSH ile bağlan (IP adresini DigitalOcean panelinden al)
ssh root@YOUR_DROPLET_IP

# İlk güvenlik güncellemesi
apt update && apt upgrade -y
```

### 3. Gerekli Yazılımları Yükle

```bash
# Ubuntu 22.04 LTS için optimize edilmiş kurulum
# PHP repository ekle (PHP 8.2 için - Laravel 11 gereksinimi)
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update

# Web sunucusu ve PHP 8.2 (Laravel 11 için gerekli)
apt install -y nginx php8.2 php8.2-fpm php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-cli unzip git

# Composer (PHP paket yöneticisi)
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Composer'ın çalıştığını doğrula
composer --version

# Node.js (Frontend için)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Firewall ayarları
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### 4. Projeyi Klonla ve Kur

```bash
# Proje dizini oluştur
mkdir -p /var/www
cd /var/www

# GitHub'dan projeyi klonla
git clone https://github.com/kocidev/project_vizyon.git

# Git güvenlik ayarını yap (önemli!)
git config --global --add safe.directory /var/www/project_vizyon

# Dosya sahipliğini ayarla
chown -R www-data:www-data project_vizyon
cd project_vizyon

# Backend kurulumu
cd backend
composer install --optimize-autoloader --no-dev
cp .env.example .env

# Uygulama anahtarı oluştur
php artisan key:generate

# Veritabanı oluştur
touch database/database.sqlite
php artisan migrate --force

# Laravel optimizasyonları
php artisan config:cache
php artisan route:cache

# Dosya izinleri
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Frontend kurulumu
cd ../frontend
npm install
npm run build
```

### 5. Nginx Konfigürasyonu (Tek Domain)

Maliyet tasarrufu için tek domain kullanacağız:
- **Ana site:** yourdomain.com
- **API:** yourdomain.com/api

```bash
# Nginx konfigürasyon dosyası oluştur
nano /etc/nginx/sites-available/project-vizyon
```

Aşağıdaki konfigürasyonu yapıştır:

```nginx
server {
    listen 80;
    server_name alikoc.dev www.alikoc.dev 46.101.106.215;
    
    # Frontend (React) - Ana dizin
    root /var/www/project_vizyon/frontend/dist;
    index index.html;

    # Frontend için ana konum
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - /api ile başlayan istekler
    location /api {
        alias /var/www/project_vizyon/backend/public;
        try_files $uri $uri/ @api;
        
        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/project_vizyon/backend/public/index.php;
            include fastcgi_params;
            fastcgi_param PATH_INFO $fastcgi_path_info;
        }
    }

    location @api {
        rewrite /api/(.*)$ /api/index.php?/$1 last;
    }

    # Static dosyalar için cache
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Güvenlik
    location ~ /\.ht {
        deny all;
    }
}
```

```bash
# Siteyi aktifleştir
ln -s /etc/nginx/sites-available/project-vizyon /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Nginx'i test et ve yeniden başlat
nginx -t
systemctl restart nginx
systemctl restart php8.2-fpm
```

### 6. Environment Dosyalarını Güncelle

**Backend (.env):**
```bash
nano /var/www/project_vizyon/backend/.env
```

Şu değişiklikleri yap:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://alikoc.dev

FRONTEND_URL=https://alikoc.dev

# Log seviyesini azalt (disk tasarrufu)
LOG_LEVEL=error
```

**Frontend için API URL'i:**
```bash
# Frontend'de API URL'i zaten tek domain için ayarlanmış olmalı
# src/services veya config dosyalarında /api kullandığından emin ol
```

### 7. SSL Sertifikası (Ücretsiz)

```bash
# Certbot yükle
apt install certbot python3-certbot-nginx

# SSL sertifikası al (ücretsiz)
certbot --nginx -d alikoc.dev -d www.alikoc.dev

# Otomatik yenileme
systemctl enable certbot.timer
```

### 8. Otomatik Backup Script'i

```bash
# Backup dizini oluştur
mkdir -p /backup

# Backup script'i
nano /root/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
cp /var/www/project_vizyon/backend/database/database.sqlite /backup/db-$DATE.sqlite
tar -czf /backup/project-$DATE.tar.gz /var/www/project_vizyon --exclude='node_modules' --exclude='vendor'

# Eski backup'ları sil (7 günden eski)
find /backup -name "*.sqlite" -mtime +7 -delete
find /backup -name "*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /root/backup.sh

# Günlük otomatik backup
crontab -e
# Bu satırı ekle:
0 2 * * * /root/backup.sh
```

## 🔧 Domain Ayarları

### Ücretsiz Domain Seçenekleri:
1. **Freenom** (.tk, .ml, .ga) - Ücretsiz
2. **GitHub Student Pack** - Ücretsiz .me domain
3. **Cloudflare** - Ucuz domain + ücretsiz CDN

### DNS Ayarları:
```
A Record: @ → YOUR_DROPLET_IP
A Record: www → YOUR_DROPLET_IP
```

## 📊 Performans Optimizasyonu (Düşük RAM için)

```bash
# Swap dosyası oluştur (RAM yetersizse)
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# PHP-FPM ayarları (RAM tasarrufu)
nano /etc/php/8.2/fpm/pool.d/www.conf
```

Şu değerleri değiştir:
```ini
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

## 💰 Toplam Maliyet Hesabı

- **DigitalOcean Droplet:** $6/ay
- **Domain:** $10-15/yıl (~$1/ay)
- **Toplam:** ~$7/ay ($84/yıl)

## 🚀 Deployment Script'i

```bash
# Hızlı güncelleme için
nano /root/deploy.sh
```

```bash
#!/bin/bash
cd /var/www/project_vizyon

# Backup al
cp backend/database/database.sqlite /backup/db-backup-$(date +%H%M%S).sqlite

# Güncelle
git config --global --add safe.directory /var/www/project_vizyon
git pull origin main

# Backend güncelle
cd backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan optimize

# Frontend güncelle
cd ../frontend
npm run build

# Servisleri yeniden başlat
systemctl restart php8.2-fpm
systemctl reload nginx

echo "✅ Deployment tamamlandı!"
```

```bash
chmod +x /root/deploy.sh
```

## 🆘 Sorun Giderme

### Projeyi Sıfırdan Kurmak İçin:
```bash
# Servisleri durdur
systemctl stop nginx php8.2-fpm

# Projeyi tamamen kaldır
rm -rf /var/www/project_vizyon

# Nginx config'i temizle
rm -f /etc/nginx/sites-enabled/project-vizyon
rm -f /etc/nginx/sites-available/project-vizyon

# Git ayarını temizle
git config --global --unset safe.directory /var/www/project_vizyon

# Sonra Adım 4'ten başla
```

### RAM Yetersizliği:
```bash
# RAM kullanımını kontrol et
free -h

# PHP process'leri azalt
nano /etc/php/8.2/fpm/pool.d/www.conf
```

### Disk Alanı:
```bash
# Disk kullanımını kontrol et
df -h

# Log dosyalarını temizle
journalctl --vacuum-time=7d
```

### Performans İzleme:
```bash
# Sistem durumu
htop

# Nginx durumu
systemctl status nginx

# PHP-FPM durumu
systemctl status php8.2-fpm
```

---

## 🎯 Sonuç

Bu kurulum ile sadece **$6/ay** ile hem frontend hem backend'inizi çalıştırabilirsiniz. Tek droplet kullanarak:

- ✅ Maliyet minimumu
- ✅ Kolay yönetim
- ✅ SSL sertifikası
- ✅ Otomatik backup
- ✅ Performance optimizasyonu

İhtiyacınız arttığında kolayca upgrade edebilirsiniz!
