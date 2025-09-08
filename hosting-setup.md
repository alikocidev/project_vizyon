# Project Vizyon Hosting Kurulum Rehberi

## 🚀 Genel Bakış

Bu rehber, Project Vizyon uygulamasını canlı bir hostinge kurmak için adım adım talimatlar içerir.

**Proje Yapısı:**
- Backend: Laravel 11 API (PHP 8.2+)
- Frontend: React 18 + TypeScript + Vite
- Veritabanı: SQLite

## 📋 Gereksinimler

### Backend Gereksinimleri
- PHP 8.2 veya üzeri
- Composer
- SQLite PDO extension
- OpenSSL PHP Extension
- Mbstring PHP Extension
- JSON PHP Extension

### Frontend Gereksinimleri
- Node.js 18 veya üzeri
- npm veya yarn

## 🏗️ Hosting Seçenekleri

### Seçenek 1: VPS/Cloud Server (Önerilen)
- **Avantajlar:** Tam kontrol, her iki uygulamayı da aynı sunucuda barındırabilirsiniz
- **Platformlar:** DigitalOcean, Vultr, Linode, AWS EC2

### Seçenek 2: Karma Çözüm
- **Backend:** Shared hosting (cPanel)
- **Frontend:** Vercel, Netlify, atau GitHub Pages

### Seçenek 3: Serverless
- **Backend:** Vercel, Netlify Functions
- **Frontend:** Vercel, Netlify

## 🔧 VPS/Cloud Server Kurulumu (Ubuntu)

### 1. Sunucu Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Gerekli paketleri yükle
sudo apt install -y nginx php8.2 php8.2-fpm php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip unzip git

# Composer yükle
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js yükle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Proje Dosyalarını Klonla

```bash
# Projeni sunucuya klonla
cd /var/www
sudo git clone https://github.com/kocidev/project_vizyon.git
sudo chown -R www-data:www-data project_vizyon
cd project_vizyon
```

### 3. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükle
composer install --optimize-autoloader --no-dev

# Environment dosyasını oluştur
cp .env.example .env

# Uygulama anahtarı oluştur
php artisan key:generate

# Veritabanını oluştur ve migrate et
touch database/database.sqlite
php artisan migrate --force

# Cache ve optimizasyonlar
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Dosya izinlerini ayarla
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 4. Frontend Kurulumu

```bash
cd ../frontend

# Bağımlılıkları yükle
npm install

# Production build
npm run build
```

### 5. Nginx Konfigürasyonu

Backend için nginx konfigürasyonu:

```nginx
# /etc/nginx/sites-available/project-vizyon-api
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/project_vizyon/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Frontend için nginx konfigürasyonu:

```nginx
# /etc/nginx/sites-available/project-vizyon-frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/project_vizyon/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6. Siteleri Aktifleştir

```bash
# Siteleri aktifleştir
sudo ln -s /etc/nginx/sites-available/project-vizyon-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/project-vizyon-frontend /etc/nginx/sites-enabled/

# Nginx'i test et ve yeniden başlat
sudo nginx -t
sudo systemctl restart nginx
```

## 🌐 Shared Hosting + Vercel Kurulumu

### Backend (Shared Hosting)

1. **cPanel'den Dosya Yöneticisi'ni aç**
2. `backend` klasörünü `public_html/api` dizinine yükle
3. Terminal erişimi varsa:

```bash
cd public_html/api
composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan config:cache
```

4. `.htaccess` dosyasını kontrol et (Laravel'de genellikle hazır gelir)

### Frontend (Vercel)

1. **GitHub repository'sini Vercel'e bağla**
2. **Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://yourdomain.com/api
   ```

## ⚙️ Environment Konfigürasyonu

### Backend (.env)

```env
APP_NAME=ProjectVizyon
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

FRONTEND_URL=https://yourdomain.com

DB_CONNECTION=sqlite

# API Keys (gerçek değerlerle değiştir)
TMDB_API_KEY=your_tmdb_api_key
TMDB_ACCESS_KEY=your_tmdb_access_key
STREAMING_AVAILABILITY_API_KEY=your_streaming_api_key

# Mail settings (production)
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_URL=https://yourdomain.com
```

## 🔒 SSL Sertifikası (Let's Encrypt)

```bash
# Certbot yükle
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Otomatik yenileme
sudo crontab -e
# Şu satırı ekle:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Deployment Script'i

Otomatik deployment için script oluştur:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Project Vizyon Deployment başlatılıyor..."

# Backend güncelleme
cd /var/www/project_vizyon/backend
git pull origin main
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend güncelleme
cd ../frontend
git pull origin main
npm install
npm run build

# Servisleri yeniden başlat
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

echo "✅ Deployment tamamlandı!"
```

## 📊 İzleme ve Bakım

### Log Dosyaları
- **Backend:** `/var/www/project_vizyon/backend/storage/logs/laravel.log`
- **Nginx:** `/var/log/nginx/error.log`

### Performans Optimizasyonu
```bash
# Backend optimizasyonu
php artisan optimize

# Database optimizasyonu (gerekirse)
php artisan db:seed --class=OptimizationSeeder
```

### Backup
```bash
# Veritabanı backup
cp /var/www/project_vizyon/backend/database/database.sqlite /backup/db-$(date +%Y%m%d).sqlite

# Dosya backup
tar -czf /backup/project-vizyon-$(date +%Y%m%d).tar.gz /var/www/project_vizyon
```

## 🎯 Sonraki Adımlar

1. **Domain ve DNS ayarları**
2. **SSL sertifikası kurulumu**
3. **Monitoring kurulumu**
4. **Backup stratejisi**
5. **CD/CI pipeline kurulumu**

## 🆘 Sorun Giderme

### Yaygın Sorunlar

1. **500 Internal Server Error**
   - Dosya izinlerini kontrol et
   - Laravel log dosyasını incele
   - `.env` dosyasının doğru olduğundan emin ol

2. **CORS Hatası**
   - Backend `config/cors.php` dosyasını kontrol et
   - Frontend URL'ini backend `.env` dosyasına ekle

3. **Database Connection Error**
   - SQLite dosyasının var olduğunu kontrol et
   - Dosya izinlerini kontrol et

### Debug Komutları

```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/error.log

# PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

---

**Not:** Bu rehber genel bir kılavuzdur. Hosting sağlayıcınızın özel gereksinimlerine göre uyarlamalar gerekebilir.
