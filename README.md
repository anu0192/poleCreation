# Feedback Hub - MERN Application with Fairness & Anti-Abuse Mechanisms

A modern feedback platform built with the MERN stack (MongoDB, Express, React, Node.js) that implements comprehensive fairness and anti-abuse mechanisms to ensure a safe, fair, and reliable community feedback experience.

## 🌟 Features

- ✅ **User-friendly Feedback Submission** - Simple form to submit categorized feedback
- ✅ **Real-time Statistics** - View feedback trends and average ratings
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile devices
- ✅ **Rate Limiting** - Prevents spam and abuse with IP-based rate limiting
- ✅ **Input Validation & Sanitization** - Protects against injection attacks
- ✅ **Database Persistence** - All feedback stored in MongoDB
- ✅ **Secure API** - Helmet.js for security headers, CORS protection
- ✅ **Analytics Tracking** - Track API usage patterns

---

## 🛡️ Fairness & Anti-Abuse Mechanisms

### Mechanism #1: Rate Limiting (IP-Based Request Throttling)

**Purpose:** Prevent abuse and ensure fair access for all users

**Implementation Details:**
- **Endpoint-Specific Limiters:**
  - Feedback submission: **10 requests per hour** per IP address
  - General API: **100 requests per 15 minutes** per IP address
  - Authentication: **5 attempts per 15 minutes** per IP address
  - Voting/Rating: **20 requests per hour** per IP address

**Key Features:**
- Rate limits are tracked per IP address using `express-rate-limit` middleware
- Returns `429 Too Many Requests` status when limit is exceeded
- Includes `RateLimit-*` headers to inform clients of their usage
- Whitelist system for health checks to prevent false positives
- Sliding window implementation for accurate tracking

**Benefits:**
- Prevents denial-of-service (DoS) attacks
- Stops spam submissions
- Ensures fair resource allocation
- Protects database from overload
- Discourages malicious actors

**Location:** [server/middleware/rateLimiter.js](server/middleware/rateLimiter.js)

---

### Mechanism #2: Input Validation & Sanitization

**Purpose:** Maintain data integrity and prevent injection attacks

**Implementation Details:**

1. **Email Validation:**
   - Uses `validator.isEmail()` to validate email format
   - Ensures only valid email addresses are accepted
   - Case-insensitive storage (normalized to lowercase)

2. **Content Validation:**
   - Minimum length: 2 characters
   - Maximum length: 5000 characters
   - Prevents empty or excessively long submissions

3. **Category Validation:**
   - Whitelist of allowed categories: `['bug', 'feature', 'improvement', 'other']`
   - Rejects any invalid category values

4. **Rating Validation:**
   - Must be an integer between 1 and 5
   - Type checking to prevent string numbers or floats

5. **Content Sanitization:**
   - HTML entity encoding using `validator.escape()`
   - Removal of low-control characters
   - Trimming of unnecessary whitespace
   - Applied to all string inputs in request body

6. **MongoDB Injection Prevention:**
   - `express-mongo-sanitize` middleware removes prohibited characters
   - Prevents $ and . characters in object keys (NoSQL injection)

7. **Duplicate Prevention:**
   - Checks for identical content from same email within 1 hour
   - Returns 429 status for duplicate submissions
   - Window-based detection prevents repeat spam

**Key Features:**
- Comprehensive server-side validation (never trust client)
- Consistent tag generation and escaped output
- Database schema constraints as additional safety layer
- Request body size limit (10MB max)

**Benefits:**
- Prevents XSS (Cross-Site Scripting) attacks
- Prevents NoSQL injection attacks
- Prevents HTML/JavaScript injection
- Ensures data quality and consistency
- Protects against duplicate spam submissions
- Maintains platform integrity

**Location:** [server/middleware/validation.js](server/middleware/validation.js)

---

## 📋 Edge Cases Handled

### 1. **Rate Limit Bypass Attempts**
- IP spoofing: Uses `req.ip` with proxy awareness
- Health checks excluded to prevent false positives
- Headers like `X-Forwarded-For` properly parsed

### 2. **Injection Attack Attempts**
- `<script>alert('xss')</script>` → `&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;`
- `{"$ne": null}` → Rejected by mongo-sanitize
- Unicode escape sequences → Normalized and sanitized

### 3. **Concurrent Submissions**
- Duplicate submission within 1-hour window blocked
- Same email + exact content check in database
- Prevents accidental double-submissions

### 4. **Malformed Data Types**
- String rating "5" → Rejected (must be integer)
- Float rating 4.5 → Rejected (must be 1-5 integer)
- Array email address → Rejected
- Missing required fields → 400 Bad Request

### 5. **Boundary Conditions**
- Empty content "" → Rejected (min length 2)
- Content with 5001 characters → Rejected (max length 5000)
- Rating value 0 or 6 → Rejected (range 1-5)
- Very long email addresses → Validated but accepted if valid

### 6. **Special Characters & Unicode**
- Emoji handling: ✅ Preserved and displayed correctly
- RTL (Right-to-Left) text: ✅ Handled properly
- Zero-width characters: ✅ Removed by sanitization
- SQL-like patterns: ✅ Safely escaped

### 7. **Pagination & Large Result Sets**
- Limit capped at 50 items per page (user can't request 10,000 items)
- Default page size: 10
- Prevents memory exhaustion attacks
- Efficient MongoDB queries with indexes

### 8. **Database Edge Cases**
- Duplicate index entries handled gracefully
- TTL (Time-To-Live) for analytics records (30 days)
- Compound indexes for efficient rate limit lookups
- Connection pooling to prevent resource exhaustion

---

## ⚠️ Known Limitations

### 1. **IP Address Limitations**
- IPv6 addresses in corporate networks might appear as same IP
- VPN/Proxy users might bypass rate limiting (by design - some VPN use is legitimate)
- Behind load balancers: Requires proper `X-Forwarded-For` configuration

### 2. **Duplicate Detection Window**
- Only checks for exact duplicates within 1 hour
- Different wording of similar feedback not detected
- Legitimate resubmissions after 1 hour are allowed

### 3. **MongoDB-Specific**
- Requires MongoDB Atlas or self-hosted MongoDB instance
- Sanitization only prevents NoSQL injection, not all NoN injection patterns
- TTL index requires MongoDB 2.2+ and proper configuration

### 4. **No User Authentication**
- Currently anonymous submissions (email not verified)
- No user accounts system implemented
- Could allow same person multiple emails

### 5. **CORS Configuration**
- Currently hardcoded for localhost in development
- Production requires environment variable configuration
- Credentials transmission unsecured without HTTPS

### 6. **Rate Limit Precision**
- Sliding window algorithm has microsecond tolerances
- Very high request volumes might experience slight variance
- Distributed rate limiting (multiple servers) would need Redis

### 7. **Frontend Validation**
- Relies on backend validation as primary defense
- Client-side checks are quality-of-life only
- Determined attacker can bypass frontend entirely

### 8. **Performance Considerations**
- Analytics logging on every request increases database load
- Large datasets (100k+ records) pagination might slow
- No caching layer implemented (Redis would help)

### 9. **Compliance & Legal**
- No GDPR "right to be forgotten" mechanism
- Email addresses stored indefinitely
- No data encryption at rest
- No audit logging of deletions

### 10. **Scalability**
- Single MongoDB connection (no replica sets)
- Rate limiter in-memory (resets on server restart)
- Not designed for distributed systems (multiple servers)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

**Server Setup:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT Secret
npm run dev
```

**Client Setup:**
```bash
cd client
npm install
npm start
```

### Environment Variables

**Server (.env):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

---

## 📊 API Endpoints

### Feedback Routes

**GET `/api/feedback`**
- Retrieve all feedback with pagination
- Query params: `page`, `limit`
- Returns: Array of feedback objects

**POST `/api/feedback`**
- Submit new feedback
- Rate limited: 10 per hour per IP
- Body: `{ email, category, content, rating }`
- Returns: Created feedback object

**GET `/api/feedback/stats`**
- Get feedback statistics by category
- Returns: Array of stats with count and average rating

**GET `/api/health`**
- Health check endpoint
- Rate limiting excluded

---

## 🏗️ Project Structure

```
project1/
├── server/
│   ├── middleware/
│   │   ├── rateLimiter.js       # Rate limiting implementation
│   │   └── validation.js         # Input validation & sanitization
│   ├── models/
│   │   ├── Feedback.js           # MongoDB Feedback schema
│   │   └── Analytics.js          # MongoDB Analytics schema
│   ├── routes/
│   │   ├── feedbackRoutes.js     # Feedback endpoints
│   │   └── healthRoutes.js       # Health check endpoint
│   ├── controllers/
│   │   └── feedbackController.js # Business logic
│   ├── server.js                 # Main Express app
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.js   # Form component
│   │   │   ├── FeedbackList.js   # Display feedback
│   │   │   └── Statistics.js     # Stats component
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # App styles
│   │   └── index.js              # Entry point
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## 🔐 Security Features

- ✅ Helmet.js for secure HTTP headers
- ✅ CORS protection
- ✅ Input validation/sanitization
- ✅ Rate limiting
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ Payload size limiting (10MB)

---

## 📈 Future Improvements

- [ ] User authentication with JWT
- [ ] Email verification for submissions
- [ ] AI-powered spam detection
- [ ] Advanced analytics and reporting
- [ ] Feedback tagging and categorization
- [ ] Admin dashboard
- [ ] Export feedback to CSV
- [ ] Comment threads on feedback
- [ ] Voting system (like/dislike)
- [ ] Redis caching layer
- [ ] Distributed rate limiting

---

## 📝 License

MIT License - Feel free to use this project for educational and commercial purposes.

---

## 👨‍💻 Author

Created as a demonstration of MERN stack development with emphasis on security and fairness mechanisms.

---

**Note:** This is a demonstration project. For production use, ensure proper HTTPS, environment variable management, MongoDB backup strategies, and additional security audits.
