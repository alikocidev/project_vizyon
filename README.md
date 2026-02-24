# Project Vizyon

A movie discovery application split into separate backend and frontend projects.

## Project Structure

```
project_vizyon/
├── backend/          # Laravel API backend
├── frontend/         # React frontend
└── README.md        # This file
```

## Quick Start

### Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Backend will run on `http://localhost:8000`

### Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend will run on `http://localhost:3000`

## Architecture

- **Backend**: Laravel 11 API with SQLite database
- **Frontend**: React 18 with TypeScript, Vite, and Tailwind CSS
- **Communication**: REST API with CORS enabled

## Features

- Movie and series discovery
- Theater showings
- Trending content
- Platform-specific content (Netflix, Disney+, etc.)
- Search functionality
- Responsive design

## API Integration

The project integrates with:
- TMDB (The Movie Database) API
- Streaming Availability API

## Development

Each project (backend/frontend) has its own README with detailed setup instructions.

## Live

- https://alikoc.dev/

## Images
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6a199cde-90d1-409c-9cf4-2af0f1ce5c32" />


