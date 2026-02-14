# Deployment Guide

## Quick Deployment Instructions

### Option 1: Deploy on Render (Recommended)

**Backend (Server):**
1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repo
5. Set environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
6. Build command: `cd server && npm install`
7. Start command: `node server.js`

**Frontend (Client):**
1. Create new Static Site on Render
2. Connect to GitHub repo
3. Build command: `cd client && npm install && npm run build`
4. Publish directory: `client/build`
5. Update API URL in client `App.js` to your Render backend URL

### Option 2: Deploy on Railway.app

1. Create account on Railway
2. Create new project
3. Add MongoDB plugin
4. Deploy from GitHub
5. Set environment variables
6. Copy public URL for API calls

### Option 3: Deploy on Vercel (Frontend) + Heroku (Backend)

**Heroku Backend:**
```bash
# Install Heroku CLI
heroku create your-app-name
git push heroku main
heroku config:set MONGO_URI=your_mongo_uri
```

**Vercel Frontend:**
```bash
npm install -g vercel
vercel --prod
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier available)
3. Create database user
4. Whitelist your IP address (or 0.0.0.0 for all)
5. Copy connection string
6. Add to your `.env` file

## Local Testing

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm start

# Visit http://localhost:3000
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your domain
- [ ] Add HTTPS certificate
- [ ] Set strong `JWT_SECRET`
- [ ] Enable MongoDB authentication
- [ ] Configure firewall/VPC
- [ ] Set up monitoring & logging
- [ ] Configure database backups
- [ ] Test rate limiting
- [ ] Verify email validation
