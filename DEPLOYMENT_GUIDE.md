# Hosting & Deployment Guide — Mock Interview System

This project is configured for **full-stack production deployment**. The Express backend serves both the API endpoints (`/api/*`) and the compiled React production client (`client/dist`) from a **single port and single URL**.

---

## ⚡ Method 1: Instant Public URL (Fastest — 10 Seconds, No Sign-up)
If you want an immediate live HTTPS link to show your friends, teachers, or recruiters right now while running locally on your computer:

1. In your terminal, make sure the server is running:
   ```bash
   npm start
   ```
2. Open a second terminal window and run:
   ```bash
   npx localtunnel --port 5000
   ```
3. LocalTunnel will give you a public URL (e.g., `https://brave-frog-42.loca.lt`). Anyone anywhere in the world can open that URL to access your live website!

---

## ☁️ Method 2: Free Cloud Hosting on Render.com (Recommended)
**Render** allows hosting full-stack Node.js web services for free.

### Step 1: Push your code to GitHub
1. Create a new repository on [GitHub.com](https://github.com).
2. In your project directory (`d:\Mock Interview`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Mock Interview System"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Go to [Render.com](https://render.com) and log in (with GitHub).
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`mock-interview-system`).
4. Fill in the deployment settings:
   - **Name:** `mock-interview-ai`
   - **Environment:** `Node`
   - **Region:** Any (e.g., Singapore, Frankfurt, Oregon)
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `mock_interview_super_secret_jwt_key_2026`
   - *(Optional)* `MONGO_URI` = Your free MongoDB Atlas connection string (or leave blank to use the built-in persistent storage adapter!).
6. Click **Deploy Web Service**.

Within 2–3 minutes, Render will provide a permanent live HTTPS link:
`https://mock-interview-ai.onrender.com`

---

## 🍃 Setting up Free Cloud Database: MongoDB Atlas (Optional)
If you want a live cloud MongoDB database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for the **Free Shared M0 Cluster** (512 MB free forever).
2. Create a Database User (username and password).
3. Under **Network Access**, click **Add IP Address** -> **Allow Access from Anywhere (`0.0.0.0/0`)**.
4. Click **Connect** -> **Connect your application (Drivers)** and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/mock_interview?retryWrites=true&w=majority
   ```
5. Paste this connection string into your `.env` or Render environment variables as `MONGO_URI`.

---

## 🚂 Method 3: Railway.app
1. Go to [Railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository. Railway automatically detects Node.js and runs `npm run build` & `npm start`.
4. Under **Variables**, add `JWT_SECRET` and `NODE_ENV=production`.
5. Under **Settings** -> **Networking**, click **Generate Domain**.

---

## 📁 Decoupled Hosting: Vercel (Frontend) + Render (Backend)
If you prefer hosting the React frontend separately on Vercel:
1. **Deploy Backend to Render**:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `node server.js`
   - Copy backend URL (e.g., `https://mock-interview-api.onrender.com`).
2. **Deploy Frontend to Vercel**:
   - Go to [Vercel.com](https://vercel.com) -> New Project.
   - Select repository, set root directory to `client`.
   - Framework preset: `Vite`.
   - In `client/src/services/api.js`, update `API_BASE` to your Render backend URL.
