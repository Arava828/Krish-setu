# Krishi Setu — Architecture & Deployment Documentation

**Project:** Krishi Setu — A Bridge to Market
**Phase:** 3 — Optimization, Real-time Features & Deployment
**Live URL:** https://krish-setu.vercel.app
**Backend API:** https://krish-setu-backend.onrender.com/api
**Repository:** https://github.com/Arava828/Krish-setu

---

## 1. Overview

Krishi Setu is a full-stack web platform that connects farmers directly with buyers and markets, cutting out unnecessary middlemen. The platform allows farmers to list crops and manage their details (farm size, experience, location), while buyers can browse crop listings and market trends. The application is fully deployed and publicly accessible.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite build tool) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | Token-based auth via `/api/auth` routes |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git + GitHub |

---

## 3. System Architecture

```
┌─────────────────────┐         HTTPS          ┌──────────────────────┐
│   React Frontend      │  ───────────────────▶  │   Express Backend      │
│   (Vite, hosted on     │                        │   (Node.js, hosted on  │
│    Vercel)              │  ◀───────────────────  │    Render)              │
└─────────────────────┘      JSON API responses  └───────────┬──────────┘
                                                                │
                                                                │ Mongoose
                                                                ▼
                                                    ┌──────────────────────┐
                                                    │      MongoDB Atlas      │
                                                    │   (cloud database)      │
                                                    └──────────────────────┘
```

**Request flow:**
1. User interacts with the React frontend in the browser.
2. Frontend calls the backend REST API using Axios, with the base URL configured via the `VITE_API_URL` environment variable.
3. Express backend processes the request, applies CORS validation, and queries MongoDB through Mongoose models.
4. Backend returns JSON responses, which the frontend renders.

---

## 4. Key Backend Routes

| Route prefix | Purpose |
|---|---|
| `/api/auth` | User registration and login |
| `/api/users` | User profile management |
| `/api/crops` | Crop listings (create, browse, filter) |
| `/api/orders` | Order placement and tracking |
| `/api/weather` | Weather data by city (supports farmer planning decisions) |

---

## 5. Frontend Routing

The frontend is a Single Page Application (SPA) built with React Router. Because Vercel serves static files by default, a rewrite rule was added to ensure all routes correctly fall back to `index.html`, allowing React Router to handle client-side navigation without triggering server-side 404s on refresh or direct URL access:

```json
// frontend/vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 6. Deployment Process

### Frontend (Vercel)
1. Repository connected to Vercel via GitHub integration.
2. Vercel auto-builds on every push to `main` using `npm run build` (Vite).
3. Environment variable `VITE_API_URL` set in Vercel dashboard to point to the live Render backend URL.
4. Production domain: `krish-setu.vercel.app`, with additional preview/branch domains generated automatically per deployment.

### Backend (Render)
1. Repository connected to Render via GitHub integration.
2. Render auto-deploys on every push to `main`.
3. Environment variables configured in Render dashboard, including `MONGODB_URI` (MongoDB Atlas connection string) and `PORT`.
4. CORS explicitly configured to allow requests only from trusted origins (localhost for development, plus the production Vercel domains) with credentials enabled:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://krish-setu.vercel.app',
    'https://krish-setu-git-main-arava-ajay-kumar.vercel.app'
  ],
  credentials: true
}));
```

### Database (MongoDB Atlas)
- Cloud-hosted MongoDB cluster.
- Connection managed through Mongoose; the server only starts accepting requests after a successful database connection is established.

---

## 7. Version Control & Repository Hygiene

During development, `node_modules` was briefly and accidentally committed to the repository due to a missing `.gitignore` file. This was resolved by:
1. Removing `node_modules` from git tracking (`git rm -r --cached`).
2. Adding a root-level `.gitignore` covering `node_modules/`, `.env` files, and build output directories.
3. Verifying enforcement with `git check-ignore`.

This keeps the repository lightweight and avoids exposing environment secrets or bloating the deployment.

---

## 8. Environment Variables

| Variable | Used in | Purpose |
|---|---|---|
| `VITE_API_URL` | Frontend | Points frontend API calls to the backend base URL |
| `MONGODB_URI` | Backend | MongoDB Atlas connection string |
| `PORT` | Backend | Server port (defaults to 5000 locally, set by Render in production) |

*(Note: `.env` files are excluded from version control via `.gitignore` and configured directly in each platform's dashboard.)*

---

## 9. Summary

Krishi Setu is deployed end-to-end with a decoupled frontend/backend architecture: a Vite-built React SPA on Vercel communicating over a secured, CORS-restricted REST API with an Express backend on Render, backed by MongoDB Atlas. Both frontend and backend are connected to GitHub for continuous deployment — any push to `main` automatically triggers a new build and deployment on both platforms.
