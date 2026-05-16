---
name: project-rentify
description: Rentify full-stack peer-to-peer rental marketplace — stack, structure, and current state
metadata:
  type: project
---

Full-stack rental marketplace app at `/Users/apple/Desktop/react/rentify`.

**Why:** User's project to build a peer-to-peer rental platform with nearby search, trust scores, and rental workflow management.

**Stack:**
- Frontend: React 19 + Vite, Tailwind CSS, React Router DOM v7, Axios, Context API
- Backend: Node.js + Express (ES Modules), MongoDB Atlas + Mongoose, JWT, Multer
- DB models: User (trust score, location, govtId), Product (images, hourly/daily pricing, location), Rental (full lifecycle)

**Structure:**
- `frontend/` — Vite React app, runs on port 5173
- `backend/` — Express API, runs on port 5001
- `backend/uploads/` — local file storage (products/, govids/, profiles/)

**API routes:** /api/auth, /api/products, /api/rentals, /api/users

**Trust system:** 0–100 points, starts at 100. Updated by owner after rental completion (onTime +5, late -10, damage -20, fraud -50).

**Rental lifecycle:** pending → accepted/rejected → returned → completed

**Deployment target:** Vercel (frontend), Render (backend), MongoDB Atlas (DB)

**How to apply:** When making changes, remember both servers must be running. Frontend env: VITE_API_URL and VITE_BACKEND_URL. Backend env: MONGO_URI, JWT_SECRET, FRONTEND_URL.
