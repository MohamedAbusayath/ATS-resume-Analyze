# ATS Resume Checker - Deployment Guide

This project is split into a **Spring Boot Backend** and a **React Frontend**.

## 🚀 Deployed URLs

- **Backend (Render):** `https://your-backend-name.onrender.com`
- **Frontend (Netlify):** `https://your-frontend-name.netlify.app`

---

## 🛠️ Backend Deployment (Render.com)

1. **Create a New Web Service** on Render.
2. **Connect your GitHub Repository**.
3. **Select the Project Root** (the folder containing `pom.xml` and `Dockerfile`).
4. **Environment Variables**:
   - `SERVER_PORT`: `8080`
5. **Build Command**: Render will automatically use the `Dockerfile` in the root.

---

## 💻 Frontend Deployment (Netlify)

1. **Create a New Site** on Netlify.
2. **Connect your GitHub Repository**.
3. **Base Directory**: `frontend`
4. **Build Command**: `npm run build`
5. **Publish Directory**: `frontend/dist`
6. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api/resume`

---

## 📦 Local Setup

### Backend

```bash
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
