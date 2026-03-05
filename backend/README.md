# Project Vizyon - Backend

Laravel API backend for Project Vizyon movie application.

## Requirements

- PHP 8.2+
- Composer
- SQLite (or MySQL/PostgreSQL)

## Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

5. Start the server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

Base API prefix: `/v1`

## Environment Variables

Make sure to set the following in your `.env` file:

```
TMDB_API_KEY=your_tmdb_api_key
TMDB_ACCESS_KEY=your_tmdb_access_key
STREAMING_AVAILABILITY_API_KEY=your_streaming_api_key
```

## Deploy on Railway

Set your Railway service root to `backend/` and add these environment variables:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

DB_CONNECTION=mysql
DB_HOST=...
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...
```

Run these commands after each deployment (or configure them in your deploy pipeline):

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
```

Optional worker service command:

```bash
php artisan queue:work --tries=3 --timeout=90
```

