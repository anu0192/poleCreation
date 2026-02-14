# Architecture & Design Documentation

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React)                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FeedbackForm   FeedbackList   Statistics           │   │
│  │       ↓              ↓              ↓                │   │
│  │      HTTP API Calls (axios)                         │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
    ┌──────────────────────────────────────────────────┐
    │        Server (Express.js)                      │
    │  ┌──────────────────────────────────────────┐   │
    │  │ CORS Middleware | Helmet | Body Parser   │   │
    │  ├──────────────────────────────────────────┤   │
    │  │ [Rate Limiter] [Input Validation]        │   │
    │  ├──────────────────────────────────────────┤   │
    │  │ Routes:                                  │   │
    │  │  - POST   /api/feedback    (10/hour)     │   │
    │  │  - GET    /api/feedback    (pagination)  │   │
    │  │  - GET    /api/feedback/stats            │   │
    │  │  - GET    /api/health                    │   │
    │  ├──────────────────────────────────────────┤   │
    │  │ Controllers → Models → MongoDB           │   │
    │  └──────────────────────────────────────────┘   │
    └───────┬────────────────────────────────────────┘
            │ MongoDB Wire Protocol
            ↓
    ┌──────────────────────────────────────────────────┐
    │        MongoDB Atlas (Cloud Database)           │
    │  ┌──────────────────────────────────────────┐   │
    │  │ Collections:                             │   │
    │  │  - feedback     (feedback submissions)    │   │
    │  │  - analytics    (usage tracking)         │   │
    │  └──────────────────────────────────────────┘   │
    └──────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Client)
- **React 18.2.0** - UI library
- **axios** - HTTP client for API calls
- **CSS3** - Styling with gradients and animations
- **React Scripts** - Build tools

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **express-rate-limit** - Rate limiting
- **validator** - Input validation
- **express-mongo-sanitize** - NoSQL injection prevention
- **bcryptjs** - Password hashing (for future auth)
- **helmet** - Security headers
- **cors** - Cross-Origin Resource Sharing

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- Collections: `feedback`, `analytics`

## API Endpoints

### Feedback Endpoints

#### POST `/api/feedback`
Submit new feedback
- **Rate Limit:** 10 per hour per IP
- **Authentication:** None (anonymous)
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "category": "feature|bug|improvement|other",
    "content": "Feedback text (2-5000 chars)",
    "rating": 1-5
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Feedback submitted successfully",
    "data": { /* feedback object */ }
  }
  ```
- **Response (429):**
  ```json
  {
    "success": false,
    "message": "Too many feedback submissions. Please try again later."
  }
  ```

#### GET `/api/feedback`
Retrieve feedback with pagination
- **Rate Limit:** 100 per 15 minutes per IP
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10, max: 50)
- **Response (200):**
  ```json
  {
    "success": true,
    "data": [ /* array of feedback */ ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
  ```

#### GET `/api/feedback/stats`
Get statistics aggregated by category
- **Response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "feature",
        "count": 15,
        "avgRating": 4.2
      }
    ]
  }
  ```

#### GET `/api/health`
Health check (no rate limit)
- **Response:** `{ "status": "Server is running" }`

## Data Models

### Feedback Schema
```javascript
{
  _id: ObjectId,
  email: String (required, lowercase, indexed),
  category: String (enum: 'bug', 'feature', 'improvement', 'other'),
  content: String (required, 2-5000 chars),
  rating: Number (required, 1-5),
  ipAddress: String (required, indexed),
  userAgent: String,
  createdAt: Date (default: now, indexed, TTL: none),
  updatedAt: Date (default: now)
}

Indexes:
- { ipAddress: 1, createdAt: -1 } - For rate limit lookups
- { email: 1, createdAt: -1 }     - For duplicate detection
```

### Analytics Schema
```javascript
{
  _id: ObjectId,
  ipAddress: String (required, indexed),
  endpoint: String (required),
  method: String (enum: GET/POST/PUT/DELETE/PATCH),
  statusCode: Number (required),
  timestamp: Date (default: now, TTL: 30 days),
  requestCount: Number (default: 1)
}

Index:
- { timestamp: 1 } with expireAfterSeconds: 2592000 (auto-delete after 30 days)
```

## Fairness Mechanisms - Deep Dive

### 1. Rate Limiting Implementation

**File:** `server/middleware/rateLimiter.js`

**How it works:**
```javascript
// Tracks requests per IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,        // 1 hour
  max: 10,                          // 10 requests per hour
  message: 'Too many requests...',
  keyGenerator: (req) => req.ip     // Use IP as key
})
```

**Process Flow:**
1. Request arrives at `/api/feedback`
2. Middleware checks Redis/memory for IP's recent requests
3. If under limit → increment counter, allow request
4. If over limit → reject with 429 status
5. Counter resets after `windowMs`

**Benefits:**
- Prevents broadcast spam
- Protects database from overload
- Deters malicious actors (no easy DOS)
- Fair for legitimate users

### 2. Input Validation & Sanitization

**File:** `server/middleware/validation.js`

**Validation Pipeline:**

```
Request → 
  ┌─ Store original values
  ├─ Validate email format
  ├─ Validate category (whitelist)
  ├─ Validate rating (1-5 integer)
  ├─ Validate content length (2-5000)
  └─ Sanitize all strings
    ├─ Trim whitespace
    ├─ Strip control characters
    ├─ Escape HTML entities
    └─ Remove dangerous patterns
  │
  ├─ Check for duplicate within 1 hour
  │
  ├─ Save to database (Mongoose validates again)
  │
  └─ Return sanitized result
```

**Key Validations:**

| Field | Rules | Example (Invalid) |
|-------|-------|-------------------|
| email | Valid email format | "not-an-email" |
| category | One of 4 options | "spam" |
| content | 2-5000 chars | "" (empty) |
| rating | Integer 1-5 | "10", "4.5", 0 |

**Sanitization Examples:**

| Input | Output | Reason |
|-------|--------|--------|
| `<script>alert('xss')</script>` | `&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;` | Escape HTML |
| `test  value` | `test value` | Trim whitespace |
| `{"$ne": null}` | Rejected | Block NoSQL injection |

## Request Flow Example

### User Submits Feedback

```
1. CLIENT (React)
   │
   ├─ User fills form
   ├─ Click "Submit Feedback"
   ├─ Validate data (basic)
   └─ POST /api/feedback with data
       │
       └─────────────────────────────────────┐
                                              │
2. SERVER (Express)                          │
   │                                          │
   ├─ Create request object                  │
   │  ├─ body: { email, category, content, rating }
   │  ├─ ip: 192.168.1.100
   │  └─ user-agent: Mozilla/5.0...
   │                                          │
   ├─ [Rate Limiter Middleware] ◄────────────┤
   │  ├─ Check: 192.168.1.100 requests/hour
   │  ├─ Count: 3 requests (under 10 limit)
   │  └─ ✅ PASS - Continue
   │                                          │
   ├─ [Input Validation Middleware]          │
   │  ├─ Trim and sanitize all strings
   │  ├─ Escape HTML: "<test>" → "&lt;test&gt;"
   │  └─ ✅ PASS - Cleaned data
   │                                          │
   ├─ [Feedback Controller]                  │
   │  ├─ Validate email: isEmail()
   │  ├─ Validate category: enum check
   │  ├─ Validate rating: parseInt, 1-5
   │  ├─ Validate content: length 2-5000
   │  ├─ Check for duplicate: query last 1 hour
   │  └─ ✅ ALL VALID
   │                                          │
   ├─ Create Feedback model:                 │
   │  {                                       │
   │    email: "test@example.com",            │
   │    category: "feature",                  │
   │    content: "Great app!",                │
   │    rating: 5,                            │
   │    ipAddress: "192.168.1.100",           │
   │    userAgent: "Mozilla/5.0..."           │
   │  }                                       │
   │                                          │
   ├─ [MongoDB] Save to database             │
   │  ├─ Validate schema constraints
   │  ├─ Check indexes
   │  ├─ Insert document
   │  └─ Return with _id
   │                                          │
   ├─ Log Analytics record                   │
   │                                          │
   └─ Response 201: { success: true, data }
       │
       └─────────────────────────────────────┐
                                              │
3. CLIENT (React)                            │
   │                                          │
   └─ Receive response ◄─────────────────────┤
      ├─ success.json warning
      ├─ Show success message
      ├─ Refresh feedback list
      ├─ Clear form
      └─ Update statistics
```

## Security Layers

### Layer 1: Network
- CORS whitelist
- HTTPS (production)
- TLS/SSL encryption

### Layer 2: API Gateway
- Rate limiting per IP
- Request size limits (10MB)

### Layer 3: Application
- Input validation
- HTML entity encoding
- Type checking

### Layer 4: Database
- MongoDB sanitization
- Schema validation
- Query parameterization

## Performance Optimizations

### Frontend
- CSS-in-JS (minimal bundle size)
- Lazy component loading
- Debounced form submission
- Pagination for large lists

### Backend
- Database indexes for common queries
- Pagination limits (max 50 items)
- Connection pooling
- TTL indexes for auto-cleanup

### Database
- Compound indexes for rate limiting
- TTL for analytics cleanup
- Aggregation pipeline for stats

## Scalability Considerations

### Current Limitations
- In-memory rate limiter (resets on restart)
- Single MongoDB connection
- No caching layer

### For Production Scaling
- Use Redis for distributed rate limiting
- Implement MongoDB replica sets
- Add Elasticsearch for analytics
- Use CDN for static assets
- Load balance with nginx
- Container orchestration (Kubernetes)

## Error Handling

### Client Errors (4xx)
- 400 Bad Request - Invalid input
- 429 Too Many Requests - Rate limit exceeded

### Server Errors (5xx)
- 500 Internal Server Error - Database/server issues

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": "Detailed error (dev only)"
}
```

## Testing Strategy

### Unit Tests
- Validation functions
- Sanitization logic
- Rate limit calculations

### Integration Tests
- Full feedback submission flow
- Rate limit enforcement
- Duplicate detection

### E2E Tests
- User journey from form to stats
- Error scenarios
- Pagination

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure valid CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set strong `JWT_SECRET`
- [ ] Enable MongoDB authentication
- [ ] Configure database backups
- [ ] Set up monitoring (New Relic, DataDog)
- [ ] Enable logging (ELK stack)
- [ ] Configure CI/CD pipeline
- [ ] Load testing (Apache JMeter)
- [ ] Security audit (OWASP)
- [ ] Backup strategy (daily snapshots)

---

For questions, refer to README.md and GETTING_STARTED.md
