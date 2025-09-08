#!/bin/bash

# Project Vizyon Automated Deployment Script
# Bu script'i çalıştırmadan önce gerekli izinleri verin: chmod +x deploy.sh

set -e # Hata durumunda script'i durdur

echo "🚀 Project Vizyon Deployment başlatılıyor..."
echo "📅 Tarih: $(date)"

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/project_vizyon"
BACKUP_DIR="/backup"

# Backup dizini oluştur
sudo mkdir -p $BACKUP_DIR

echo -e "${BLUE}📂 Proje dizinine geçiliyor...${NC}"
cd $PROJECT_DIR

echo -e "${YELLOW}💾 Backup alınıyor...${NC}"
# Veritabanı backup
sudo cp backend/database/database.sqlite $BACKUP_DIR/db-$(date +%Y%m%d-%H%M%S).sqlite
echo "✅ Veritabanı backup alındı"

# Kod backup
sudo tar -czf $BACKUP_DIR/project-vizyon-$(date +%Y%m%d-%H%M%S).tar.gz . --exclude='./node_modules' --exclude='./vendor'
echo "✅ Kod backup alındı"

echo -e "${BLUE}📥 Git repository güncelleniyor...${NC}"
sudo git fetch origin
sudo git reset --hard origin/main
sudo git pull origin main
echo "✅ Git güncellendi"

echo -e "${BLUE}🔧 Backend güncelleniyor...${NC}"
cd backend

# Composer bağımlılıklarını güncelle
sudo composer install --optimize-autoloader --no-dev --quiet
echo "✅ Composer bağımlılıkları güncellendi"

# Laravel cache temizle ve optimize et
sudo php artisan down --message="Sistem güncelleniyor..." --retry=60
sudo php artisan config:clear
sudo php artisan cache:clear
sudo php artisan route:clear
sudo php artisan view:clear
echo "✅ Cache temizlendi"

# Veritabanı migrate et
sudo php artisan migrate --force
echo "✅ Veritabanı migrate edildi"

# Laravel optimize et
sudo php artisan config:cache
sudo php artisan route:cache
sudo php artisan view:cache
sudo php artisan optimize
echo "✅ Laravel optimize edildi"

# Uygulamayı tekrar açık hale getir
sudo php artisan up
echo "✅ Uygulama yeniden aktif"

echo -e "${BLUE}⚛️ Frontend güncelleniyor...${NC}"
cd ../frontend

# Node modules güncelle
sudo npm ci --production=false
echo "✅ NPM bağımlılıkları güncellendi"

# Production build
sudo npm run build
echo "✅ Frontend build edildi"

echo -e "${BLUE}🔧 Dosya izinleri ayarlanıyor...${NC}"
# Backend izinleri
sudo chown -R www-data:www-data $PROJECT_DIR/backend/storage
sudo chown -R www-data:www-data $PROJECT_DIR/backend/bootstrap/cache
sudo chmod -R 775 $PROJECT_DIR/backend/storage
sudo chmod -R 775 $PROJECT_DIR/backend/bootstrap/cache
echo "✅ Backend izinleri ayarlandı"

# Frontend izinleri
sudo chown -R www-data:www-data $PROJECT_DIR/frontend/dist
echo "✅ Frontend izinleri ayarlandı"

echo -e "${BLUE}🔄 Servisleri yeniden başlatılıyor...${NC}"
# PHP-FPM yeniden başlat
sudo systemctl restart php8.2-fpm
echo "✅ PHP-FPM yeniden başlatıldı"

# Nginx yeniden başlat
sudo systemctl reload nginx
echo "✅ Nginx reload edildi"

echo -e "${GREEN}✅ Deployment başarıyla tamamlandı!${NC}"
echo -e "${YELLOW}📊 Site durumu kontrol ediliyor...${NC}"

# Site durumu kontrol et
if curl -f -s "http://localhost" > /dev/null; then
    echo -e "${GREEN}✅ Frontend erişilebilir${NC}"
else
    echo -e "${RED}❌ Frontend erişilemiyor${NC}"
fi

if curl -f -s "http://localhost/api" > /dev/null; then
    echo -e "${GREEN}✅ Backend API erişilebilir${NC}"
else
    echo -e "${RED}❌ Backend API erişilemiyor${NC}"
fi

echo -e "${BLUE}📋 Deployment özeti:${NC}"
echo "  📅 Tarih: $(date)"
echo "  🌿 Branch: $(git branch --show-current)"
echo "  📝 Son commit: $(git log -1 --pretty=format:'%h - %s (%an)')"
echo "  💾 Backup konumu: $BACKUP_DIR"

echo -e "${GREEN}🎉 Deployment tamamlandı! Site güncellendi.${NC}"
