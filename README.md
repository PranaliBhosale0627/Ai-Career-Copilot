# CareerCo-pilot (Separated Frontend and Backend)

This project has been split into a dedicated frontend and backend folder architecture.

## Folder Structure
- `/frontend`: Vite + React web application.
- `/backend`: Node.js + Express.js backend API (running on port 5000).

---

## Getting Started

### 1. Set Up MongoDB
Install and start MongoDB locally, or use a MongoDB Atlas connection string.

The backend defaults to:
```env
MONGODB_URI="mongodb://127.0.0.1:27017"
MONGODB_DB_NAME="careerco_pilot"
MONGODB_COLLECTION_NAME="app_state"
```

### 2. Set Up the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file inside the `backend` folder and add your Gemini API key and MongoDB settings:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   MONGODB_URI="mongodb://127.0.0.1:27017"
   MONGODB_DB_NAME="careerco_pilot"
   MONGODB_COLLECTION_NAME="app_state"
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 3. Set Up the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`. It will automatically proxy all `/api` calls to the backend on port 5000.*

---

## Deployment Plan

### Backend on Render
1. Push this repository to GitHub.
2. Create a new Render Web Service from the repository.
3. Use these settings:
   ```text
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Health Check Path: /health
   ```
4. Add these Render environment variables:
   ```env
   NODE_ENV="production"
   MONGODB_URI="your-mongodb-atlas-connection-string"
   MONGODB_DB_NAME="careerco_pilot"
   MONGODB_COLLECTION_NAME="app_state"
   GEMINI_API_KEY="your-gemini-api-key"
   CORS_ORIGIN="https://your-vercel-app.vercel.app"
   ```
5. Deploy the service and copy the Render URL, for example:
   ```text
   https://careerco-pilot-backend.onrender.com
   ```

The included `render.yaml` can also be used as a Render Blueprint.

### Frontend on Vercel
1. Create a new Vercel project from the same repository.
2. Use these settings:
   ```text
   Root Directory: frontend
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
3. Add this Vercel environment variable:
   ```env
   VITE_API_BASE_URL="https://your-render-backend.onrender.com"
   ```
4. Deploy the frontend.
5. After Vercel gives you the final frontend URL, update Render's `CORS_ORIGIN` to that exact URL and redeploy the backend.

### Local vs Production API URLs
Locally, the frontend can leave `VITE_API_BASE_URL` empty and use the Vite `/api` proxy to `http://localhost:5000`.

In production, Vercel must set `VITE_API_BASE_URL` to the Render backend URL because the local Vite proxy is not part of the static production build.
