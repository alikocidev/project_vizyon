# 🚀 Project Vizyon - Hızlı Kurulum Rehberi

## Seçenek 1: VPS/Cloud Server (Ubuntu)

### 1. Sistem Hazırlığı
```bash
# Gerekli paketleri yükle
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx php8.2 php8.2-fpm php8.2-sqlite3 php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip unzip git

# Composer yükle
curl -sS https://getcomposer.org/installer | php && sudo mv composer.phar /usr/local/bin/composer

# Node.js yükle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
```

### 2. Projeyi İndir ve Kur
```bash
cd /var/www
sudo git clone https://github.com/kocidev/project_vizyon.git
sudo chown -R www-data:www-data project_vizyon
cd project_vizyon

# Backend kur
cd backend
composer install --optimize-autoloader --no-dev
cp .env.production .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan optimize
sudo chown -R www-data:www-data storage bootstrap/cache

# Frontend kur
cd ../frontend
npm install && npm run build
```

### 3. Nginx Konfigürasyonu
```bash
# Backend için
sudo cp nginx-backend.conf /etc/nginx/sites-available/project-vizyon-api
sudo ln -s /etc/nginx/sites-available/project-vizyon-api /etc/nginx/sites-enabled/

# Frontend için
sudo cp nginx-frontend.conf /etc/nginx/sites-available/project-vizyon-frontend
sudo ln -s /etc/nginx/sites-available/project-vizyon-frontend /etc/nginx/sites-enabled/

# Domain adlarını düzenle
sudo nano /etc/nginx/sites-available/project-vizyon-api    # api.yourdomain.com
sudo nano /etc/nginx/sites-available/project-vizyon-frontend # yourdomain.com

sudo nginx -t && sudo systemctl restart nginx
```

### 4. SSL Sertifikası
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## Seçenek 2: Shared Hosting + Vercel

### Backend (cPanel)
1. `backend` klasörünü `public_html/api` dizinine yükle
2. Terminal'den:
```bash
cd public_html/api
composer install --optimize-autoloader --no-dev
cp .env.production .env
php artisan key:generate && php artisan migrate --force && php artisan optimize
```

### Frontend (Vercel)
1. GitHub repo'yu Vercel'e bağla
2. Build ayarları:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
3. Environment Variables:
   ```
   VITE_API_URL=https://yourdomain.com/api
   ```

---

## 📝 Önemli Notlar

### Environment Dosyalarını Güncelle
- **Backend:** `.env` dosyasında domain adlarını ve API keylerini güncelle
- **Frontend:** `.env` dosyasında backend API URL'ini güncelle

### Güvenlik
- Production'da `APP_DEBUG=false` olmalı
- Güçlü `APP_KEY` kullan
- TMDB ve Streaming API keylerini gizli tut

### Deployment
```bash
# Otomatik deployment için
chmod +x deploy.sh
./deploy.sh
```

### Domain Ayarları
- **Frontend:** yourdomain.com
- **Backend API:** api.yourdomain.com

---

## 🆘 Sorun Giderme

### Log Dosyaları
```bash
# Laravel logs
tail -f /var/www/project_vizyon/backend/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/error.log
```

### Yaygın Sorunlar
1. **500 Error:** Dosya izinlerini kontrol et
2. **CORS Error:** Backend'de frontend URL'ini `.env` dosyasına ekle
3. **Database Error:** SQLite dosyasının var olduğunu kontrol et

---

**💡 İpucu:** İlk defa hosting kuracaksan VPS seçeneğini öner. Daha fazla kontrol ve öğrenme imkanı sağlar.
