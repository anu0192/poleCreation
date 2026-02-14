# GitHub & Deployment Instructions

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface
1. Go to [GitHub.com](https://github.com/new)
2. Create new repository:
   - **Repository name:** `mern-fairness-app`
   - **Description:** MERN feedback platform with fairness and anti-abuse mechanisms
   - **Public** (required for submission)
   - **Add .gitignore:** No (we already have one)
   - **License:** MIT
3. Click "Create repository"

### Option B: Using GitHub CLI
```bash
gh repo create mern-fairness-app --public --source=. --remote=origin --push
```

## Step 2: Push to GitHub

```bash
# Navigate to project
cd c:\Users\anusr\Desktop\project1

# Add remote (replace USERNAME and REPO with your values)
git remote add origin https://github.com/USERNAME/mern-fairness-app.git

# Verify remote
git remote -v

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify GitHub Upload

1. Go to `https://github.com/USERNAME/mern-fairness-app`
2. Verify all files are there:
   - ✅ README.md
   - ✅ GETTING_STARTED.md
   - ✅ ARCHITECTURE.md
   - ✅ server/ folder
   - ✅ client/ folder
   - ✅ All configuration files

---

## Deployment Guide

### Option 1: Render.com (RECOMMENDED - Easiest)

#### Backend Deployment

1. **Prepare Repository**
   ```bash
   git push origin main  # Make sure latest code is on GitHub
   ```

2. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub
   - Authorize connections

3. **Deploy Backend**
   - Dashboard → New → Web Service
   - Connect to GitHub repo
   - Configuration:
     ```
     Name: mern-fairness-app-server
     Environment: Node
     Plan: Free
     Build Command: cd server && npm install
     Start Command: cd server && node server.js
     ```
   - Environment Variables:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app
     JWT_SECRET=your_secret_key_here
     NODE_ENV=production
     ```
   - Deploy

4. **Note Backend URL** (e.g., `https://mern-fairness-app-server.onrender.com`)

#### Frontend Deployment

1. **Deploy Frontend**
   - Dashboard → New → Static Site
   - Connect to GitHub repo
   - Configuration:
     ```
     Name: mern-fairness-app-client
     Root Directory: client
     Build Command: npm install && npm run build
     Publish Directory: build
     Environment Variables:
     REACT_APP_API_URL=https://mern-fairness-app-server.onrender.com
     ```
   - Deploy

2. **Note Frontend URL** (you'll get automatic HTTPS)

---

### Option 2: Railway.app

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Deploy Project**
   - New Project → GitHub Repo → Select your repo
   - Configure environment:
     ```
     Node version: 16.x
     ```
   - Add services:
     - MongoDB plugin (Railway provides MongoDB)
     - Copy `MONGO_URL` to env

3. **Set Environment Variables**
   - Go to project settings
   - Add variables:
     ```
     MONGO_URI=${{MONGO_URL}}
     NODE_ENV=production
     JWT_SECRET=your_key
     ```

4. **Deploy Backend**
   - Start command: `cd server && node server.js`
   - Redeploy

---

### Option 3: Heroku (Requires Credit Card)

#### Backend Deployment

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create app
heroku create mern-fairness-app-server

# Set environment variables
heroku config:set MONGO_URI="your_mongo_uri" -a mern-fairness-app-server
heroku config:set JWT_SECRET="your_secret" -a mern-fairness-app-server
heroku config:set NODE_ENV=production -a mern-fairness-app-server

# Deploy
git push heroku main

# View logs
heroku logs -a mern-fairness-app-server --tail
```

#### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables during deployment
# REACT_APP_API_URL=your_backend_url
```

---

### Option 4: Docker (Manual Server)

If you have a VPS (AWS, DigitalOcean, Linode, etc.):

```bash
# SSH into server
ssh user@your_server_ip

# Clone repo
git clone https://github.com/USERNAME/mern-fairness-app.git
cd mern-fairness-app

# Create .env file
cp server/.env.example server/.env
# Edit .env with your MongoDB URI

# Run with Docker Compose
docker-compose up -d

# Access at http://your_server_ip:3000
```

---

## Testing Deployed Application

### Test Backend Health
```bash
curl https://your-backend-url/api/health
# Should return: {"status":"Server is running"}
```

### Test Feedback Submission
```bash
curl -X POST https://your-backend-url/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "category": "feature",
    "content": "Test from deployed app",
    "rating": 5
  }'
# Should return 201 with feedback data
```

### Test Rate Limiting
Submit 11 feedbacks within 1 hour:
- ✅ Requests 1-10: Status 201
- ❌ Request 11: Status 429 (Too Many Requests)

---

## Public URL Submission

After deployment, you'll have:

**Backend URL:** `https://mern-fairness-app-server.onrender.com` (example)
**Frontend URL:** `https://mern-fairness-app.onrender.com` (example)

These URLs will be needed for the submission form.

---

## Troubleshooting Deployment

### Issue: Backend Connection Failed
**Solution:**
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0 for Render)
- Verify environment variables are set

### Issue: CORS Errors
**Solution:**
- Update CORS origins in `server/server.js`
- Add your frontend URL to the whitelist:
  ```javascript
  const corsOptions = {
    origin: ['https://your-frontend-url.com'],
    credentials: true
  };
  ```

### Issue: 404 Page Not Found
**Solution:**
- Check deployment root directory
- Verify build command: `npm run build`
- Check publish directory: `client/build`

### Issue: Rate Limiting Not Working
**Cause:** In-memory limiter resets on restart
**Solution:** Use Redis for production (future improvement)

---

## Production Checklist

Before final submission:

- [ ] GitHub repo is public
- [ ] All files are pushed to main branch
- [ ] README.md is in root directory
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Backend URL accepts POST requests to `/api/feedback`
- [ ] Rate limiting works (test with 11 submissions)
- [ ] Input validation works (test with invalid data)
- [ ] Frontend connects to backend API
- [ ] Statistics display correctly
- [ ] No console errors in browser
- [ ] No 500 errors on server logs

---

## Important Notes

1. **Keep GitHub Private** (just kidding - must be public for submission!)
2. **Protect Sensitive Data** - Never commit `.env` files (use `.env.example`)
3. **Document Everything** - Include setup/deployment instructions
4. **Test Thoroughly** - Test all features before submission
5. **Keep Backups** - Archive your work locally

---

## Support

If deployment fails:
1. Check server logs: `/api/health` endpoint
2. Verify environment variables
3. Check MongoDB connection
4. Review deployment platform documentation
5. Look at error messages carefully

---

**🎉 Once deployed, you're ready for submission!**

1. Copy your GitHub URL: `https://github.com/USERNAME/mern-fairness-app`
2. Copy your Frontend URL: `https://your-deployed-frontend.com`
3. Fill Google Form with:
   - GitHub links
   - Deployed app URL
   - Fairness mechanism explanations (from SUBMISSION_NOTES.md)
   - Edge cases handled (from README.md)
   - Known limitations (from README.md)

---

## Questions?

Refer to:
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup help
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design docs
- [README.md](./README.md) - Full documentation

---

**Good luck with your submission! 🚀**
