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

## Environment Variables

Make sure to set the following in your `.env` file:

```
TMDB_API_KEY=your_tmdb_api_key
TMDB_ACCESS_KEY=your_tmdb_access_key
STREAMING_AVAILABILITY_API_KEY=your_streaming_api_key
```

