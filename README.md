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

## Screenshots

![image](https://github.com/user-attachments/assets/bcaf9be2-8d6f-4d67-a6d4-bc2c8118bc21)
![image](https://github.com/user-attachments/assets/f5126c0f-0539-4e2a-a326-c2918271a40a)
![image](https://github.com/user-attachments/assets/1f735afb-71a6-4f57-a4e6-85de07b88ec0)
![image](https://github.com/user-attachments/assets/a451e919-8063-49ea-b114-c8df5b4334cc)

## Original Project

This project was originally created as a monolithic Laravel + Inertia.js application and has been split into separate backend and frontend projects for better maintainability and scalability.

