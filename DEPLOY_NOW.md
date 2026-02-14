# 🚀 Deployment Guide - Go Live in Minutes

Your MERN Feedback Hub app is ready for deployment! Choose your platform below.

## Quick Deploy Options

### Option 1: **Railway.app** (Recommended - Easiest)

Railway provides the fastest setup with built-in MongoDB support.

**Steps:**

1. Go to [Railway.app](https://railway.app) and sign up
2. Create a new project
3. Click "Deploy from GitHub"
4. Select `anu0192/poleCreation` repository
5. Railway auto-detects your `Procfile` - automatic setup!
6. Click "Deploy"
7. Get your public URL from the deployment dashboard
8. Update client `App.js` API URL to your Railway backend URL

**Cost:** Free tier available (512MB RAM, limited usage)

---

### Option 2: **Render** (Good Free Alternative)

**Backend Deployment:**

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub account and select `poleCreation` repo
4. Configure:
   - **Name:** `mern-feedback-backend`
   - **Environment:** Node
   - **Build Command:** `npm install` (in server directory)
   - **Start Command:** `node server.js`
   - **Publish Directory:** Leave blank

5. Add environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random string
   - `NODE_ENV`: `production`

6. Click "Create Web Service" and wait for deployment
7. Copy your backend URL

---

### Option 3: **Heroku** (Classic PaaS)

**Requires Heroku CLI:**

```bash
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name-backend

# Set environment variables
heroku config:set MONGO_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

### Option 4: **Vercel for Frontend** + **Render/Railway for Backend**

**Frontend on Vercel:**

1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub project `poleCreation`
3. Set root directory to `client`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your backend deployed URL

5. Deploy and get your frontend URL

**Backend on Render/Railway:** (Follow above steps)

---

### Option 5: **Docker + AWS/DigitalOcean**

**Using Docker Compose:**

```bash
# Build and deploy with Docker
docker-compose up --build

# For AWS EC2:
# 1. SSH into instance
# 2. Clone repo: git clone https://github.com/anu0192/poleCreation.git
# 3. docker-compose up --build
# 4. Access on your EC2 public IP:3000

# For DigitalOcean App Platform:
# 1. Upload docker-compose.yml
# 2. Set environment variables
# 3. Deploy
```

---

## MongoDB Atlas Setup (All Options)

Before deploying anywhere, set up your database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account and free cluster
3. Create database user with strong password
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app?retryWrites=true&w=majority
   ```
5. Add to environment variables as `MONGO_URI`

**Whitelist your deployment IPs:**
- Railway: Whitelist all (`0.0.0.0/0`) or check IP from dashboard
- Render: Same as above
- Heroku: Same as above

---

## Step-by-Step: Recommended Deployment (Railway)

### 1. **Set Up MongoDB**
```
1. MongoDB Atlas → Create Project
2. Create Cluster (M0 free tier)
3. Create user: admin / strong_password
4. Add IP whitelist: 0.0.0.0/0
5. Copy connection string
```

### 2. **Deploy Backend**
```
1. Railway.app → New Project
2. Deploy from GitHub → anu0192/poleCreation
3. Add environment variables:
   - MONGO_URI: your_connection_string
   - JWT_SECRET: $(openssl rand -base64 32)  # Generate random
   - NODE_ENV: production
   - PORT: 5000

4. Wait for deployment
5. Copy public URL (e.g., https://backend-xyz.railway.app)
```

### 3. **Deploy Frontend**
```
1. Railway.app → New Service
2. Deploy from GitHub → same repo
3. Set root directory: client
4. Add build override:
   - Build Command: npm run build
   - Start Command: serve -s build -l 3000

5. Add environment variables:
   - REACT_APP_API_URL: https://backend-xyz.railway.app

6. Wait for deployment
7. Your app is live at shown URL!
```

### 4. **Test Live App**
- Visit your frontend URL
- Submit feedback
- Check "View All" and "Statistics"
- Test rate limiting by submitting 11 items in succession

---

## Environment Variables Checklist

### Backend Requirements
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=your_random_secret_key_here
PORT=5000
NODE_ENV=production
```

### Frontend Requirements
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## Troubleshooting Deployment

### Issue: "Cannot find module 'express'"
**Solution:** Check package.json exists. Railway auto-installs dependencies.

### Issue: "MongoDB connection timeout"
**Solution:** 
1. Check IP whitelist in MongoDB Atlas
2. Verify credentials in MONGO_URI
3. Test connection locally first

### Issue: "Cannot GET /"
**Solution:** Frontend not serving properly. Check:
1. Build command runs successfully
2. Start command serves the build folder
3. `REACT_APP_API_URL` set correctly

### Issue: "Rate limit shows even first submission"
**Solution:** Check that server is running and client can reach it.

### Issue: "CORS Error in browser console"
**Solution:** 
1. Update backend CORS to allow your frontend domain
2. Or: Update `REACT_APP_API_URL` to exact deployment URL

---

## After Deployment

### 1. **Update Your Submission**
In the Google Form, provide:
- ✅ **Public URL:** Your deployed frontend URL
- ✅ **GitHub Repository:** https://github.com/anu0192/poleCreation
- ✅ **Notes on fairness mechanisms** (see SUBMISSION_NOTES.md)

### 2. **Verify Live Features**
- [ ] Feedback submission works
- [ ] Rate limiting enforced (test with 11 submissions)
- [ ] Statistics display updates
- [ ] Input validation prevents bad data
- [ ] All pages responsive on mobile

### 3. **Monitor Deployment**
- Check logs for errors
- Monitor API usage
- Verify database growth
- Test all endpoints

### 4. **Performance Tips**
- Use CDN for frontend assets
- Enable MongoDB compression
- Monitor database size
- Archive old analytics

---

## Quick Test Commands

After deployment, test your API:

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Get feedback
curl https://your-backend.railway.app/api/feedback

# Submit feedback (test rate limiting)
for i in {1..15}; do
  curl -X POST https://your-backend.railway.app/api/feedback \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"test$i@example.com\",
      \"category\": \"feature\",
      \"content\": \"Test feedback $i\",
      \"rating\": 5
    }"
  echo "Request $i"
done

# Get stats
curl https://your-backend.railway.app/api/feedback/stats
```

---

## Cost Estimates (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway | $5 credit | $0.50/GB + usage |
| Render | Limited | $7/month |
| Heroku | ❌ Paid only | $7/month |
| Vercel | ✅ Free | Pay as grow |
| MongoDB Atlas | 512MB free | ✅ Included free tier |

---

## Security Checklist for Production

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ chars)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Configure CORS for your domain
- [ ] Enable MongoDB IP whitelist
- [ ] Set database backups
- [ ] Monitor logs regularly
- [ ] Rate limiting active (verified)
- [ ] Input validation active (verified)
- [ ] No credentials in code/git

---

## Success! 🎉

Your MERN app is now live with:
- ✅ Rate limiting (10/hour per IP)
- ✅ Input validation & sanitization
- ✅ Real-time feedback collection
- ✅ Statistics dashboard
- ✅ Scalable architecture
- ✅ Security best practices

**Next Steps:**
1. Share the public URL
2. Collect real user feedback
3. Monitor analytics
4. Plan scaling if needed
5. Add more features (user auth, comments, voting)

For detailed docs, see README.md and ARCHITECTURE.md in the GitHub repository.

---

**Questions?** Check logs, review GETTING_STARTED.md, or test locally first with `npm run dev`
