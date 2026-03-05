# Project Vizyon - Frontend

React frontend for Project Vizyon movie application.

## Requirements

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_APP_URL=http://localhost:3000
VITE_API_URL=http://localhost:8000/v1
```

## Deploy on Vercel

Configure these project environment variables in Vercel:

```
VITE_APP_URL=https://your-frontend.vercel.app
VITE_API_URL=https://your-backend.up.railway.app/v1
```

Build settings:

```
Build command: npm run build
Output directory: dist
```

For React Router deep links, keep `vercel.json` with SPA rewrite enabled.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── services/      # API service functions
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  ├── hooks/         # Custom React hooks
  ├── providers/     # React context providers
  └── styles/        # CSS files
```

## Features

- Movie discovery and search
- Theater showings
- Trending content
- Platform-specific content
- Responsive design with Tailwind CSS
- TypeScript support
