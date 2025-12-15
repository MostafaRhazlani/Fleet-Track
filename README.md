# Fleet-Track

Fleet-Track is a full-stack vehicle fleet management application built with modern JavaScript tooling.

**Primary languages & frameworks**
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React (Vite), Redux Toolkit
- Tests: Jest

**Key libraries & tools**
- `express`, `mongoose`, `jsonwebtoken`, `pdfkit` (PDF generation)
- `react`, `reduxjs/toolkit`, `axios`, `lucide-react` (icons)
- `jest` for unit tests
- Docker & Docker Compose for containerized development

## Quick Start

Recommended: run with Docker Compose (backend, frontend, mongo):

```bash
docker-compose up -d --build
```

Local development (without Docker):

Backend
```bash
cd BACKEND
npm i
# create or update BACKEND/.env (see notes)
npm run start
```

Frontend
```bash
cd FRONTEND
npm i
npm run dev
```

## Environment variables
- `BACKEND/.env` (example values):
  - `PORT=5000`
  - `MONGO_URI=mongodb://mongo:27017/fleet_track` (use `mongo` when running with docker-compose)
  - `JWT_SECRET=your-secret`
  - `JWT_EXPIRES_IN=7d`
  - `FRONTEND_URL=http://localhost:3000` (optional; used for CORS)

## Testing & Coverage (backend)
Run tests and coverage from the `BACKEND` folder:

```bash
cd BACKEND
npm test
npm run test:coverage
```

## Docker
- `BACKEND/Dockerfile` — Dockerfile for the backend service
- `FRONTEND/Dockerfile` — multi-stage build (build with Node, serve with nginx)
- `docker-compose.yml` — orchestrates `backend`, `frontend`, and `mongo`

If you change `BACKEND/.env`, restart the backend container:

```bash
docker-compose up -d --build backend
```

## Project structure (high level)
- `BACKEND/` — server: models, repositories, services, controllers, routes
- `FRONTEND/` — React app: components, pages, store, assets, tools
