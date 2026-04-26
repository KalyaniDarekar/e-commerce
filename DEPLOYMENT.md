# Deployment Guide

This project is configured to deploy frontend on **Vercel** and backend on **Render**.

## Frontend Deployment (Vercel)

### Setup
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Build Command**: Leave as default (Vercel detects Vite)
   - **Output Directory**: `dist`

### Environment Variables
Add these in Vercel dashboard Settings → Environment Variables:
- `VITE_BACKEND_URL`: Your Render backend URL (e.g., `https://electrostore-e-commerce-app.onrender.com`)

### Deployment
- Vercel automatically deploys on every push to main branch

## Backend Deployment (Render)

### Setup
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

### Environment Variables
Add these in Render dashboard Settings → Environment Variables:
- `MONGO_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`
- `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- Any other required API keys/credentials

### Keep-Alive (Optional)
To prevent free tier from spinning down:
- Use a monitor service or add a health check endpoint (already configured at `/health`)

## Development

### Local Setup
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables (Local)
Create `.env` files in each directory using the `.env.example` templates.

## API Calls
The frontend is configured to use:
- **Development**: `http://localhost:5000`
- **Production**: The `VITE_BACKEND_URL` environment variable

## CORS Configuration
The backend CORS is configured to accept requests from:
- Frontend URL (Vercel domain)
- `http://localhost:3000` (local frontend)
- `http://localhost:5173` (Vite dev server)
