# Getting Started - Complete Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas Account** (free tier available) - [Sign Up](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mern-fairness-app.git
cd mern-fairness-app
```

### 2. Run Setup Script

**Windows:**
```bash
.\setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

This script will:
- Install server dependencies
- Install client dependencies
- Create `.env` file from template

### 3. Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Create a database user
4. Whitelist IP address (click "Add Current IP")
5. Get connection string and add to `server/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app?retryWrites=true&w=majority
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
🚀 Server is running on http://localhost:5000
📊 API Documentation available at http://localhost:5000
MongoDB connected
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

Expected output:
```
Compiled successfully!
You can now view the app in the browser.
  Local:            http://localhost:3000
```

### 5. Test the Application

1. Open http://localhost:3000 in your browser
2. Fill out the feedback form
3. Submit feedback
4. View feedback in the "View All" tab
5. Check statistics in the "Statistics" tab

## Docker Setup (Alternative)

If you have Docker installed:

```bash
docker-compose up --build
```

Then visit http://localhost:3000

## API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Submit Feedback
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "category": "feature",
    "content": "Great app!",
    "rating": 5
  }'
```

### Get All Feedback
```bash
curl http://localhost:5000/api/feedback
```

### Get Statistics
```bash
curl http://localhost:5000/api/feedback/stats
```

## Rate Limiting Test

Submit 11 feedback items within 1 hour to test rate limiting:
- 1st-10th: ✅ Success (201)
- 11th: ❌ Too Many Requests (429)

## Project Structure

```
mern-fairness-app/
├── server/                      # Backend
│   ├── middleware/
│   │   ├── rateLimiter.js      # Rate limiting logic
│   │   └── validation.js        # Input validation/sanitization
│   ├── models/
│   │   ├── Feedback.js          # Feedback schema
│   │   └── Analytics.js         # Analytics schema
│   ├── routes/                  # API routes
│   ├── controllers/             # Business logic
│   ├── server.js                # Express app
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
│
├── client/                      # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.js
│   │   │   ├── FeedbackList.js
│   │   │   └── Statistics.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml           # Docker setup
├── README.md                    # Full documentation
├── DEPLOYMENT.md                # Deployment guides
└── SUBMISSION_NOTES.md          # Submission information
```

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Install dependencies
```bash
cd server
npm install
```

### Issue: "MongoDB connection failed"
**Solution:** Check your connection string in `server/.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure credentials are correct
- Check network connectivity

### Issue: "Port 3000 or 5000 already in use"
**Solution:** Change port in `.env` (backend) or start with different port:
```bash
# Frontend with different port
PORT=3001 npm start
```

### Issue: CORS errors
**Solution:** Make sure backend is running on port 5000
- Frontend proxy is configured in `package.json`
- Backend CORS is enabled for localhost

## Environment Variables

### Server `.env`
```env
# MongoDB connection string
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# JWT secret for authentication
JWT_SECRET=your_secret_key_here

# Server port
PORT=5000

# Node environment
NODE_ENV=development
```

### Optional: Client `.env`
```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

## Next Steps

- 📚 Read [README.md](./README.md) for full documentation
- 🏗️ Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design details
- 🚀 View [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- 🔒 Review [SUBMISSION_NOTES.md](./SUBMISSION_NOTES.md) for fairness mechanisms

## Support

- **Documentation:** See README.md and inline code comments
- **Issues:** Check MongoDB connection and environment variables
- **Debugging:** Run with `NODE_DEBUG=* npm run dev` for verbose logging

## Development Tips

### Hot Reload
- Frontend: Automatic with `npm start`
- Backend: Automatic with `npm run dev` (requires nodemon)

### Database
- View collections in MongoDB Atlas dashboard
- Use MongoDB Compass for local exploration

### API Testing
- Use Postman or Insomnia for API testing
- Import requests from comments in `server.js`

### Code Style
- Use 2-space indentation
- Follow naming conventions (camelCase for variables)
- Add comments for complex logic

## Performance Optimization

1. **Frontend:**
   - Use React DevTools to identify re-renders
   - Implement pagination for large datasets
   - Optimize CSS and minify assets

2. **Backend:**
   - Add database indexes (already included)
   - Use caching for frequently accessed data
   - Monitor rate limiter performance

3. **Database:**
   - Enable compression
   - Archive old analytics data
   - Consider sharding for 100k+ documents

---

**Happy coding!** 🚀

For questions or issues, refer to the comprehensive documentation in README.md
