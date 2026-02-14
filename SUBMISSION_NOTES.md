# Google Form Submission - Fairness & Anti-Abuse Mechanisms

## Two Fairness/Anti-Abuse Mechanisms Implemented

### ✅ Mechanism #1: Rate Limiting (IP-Based Request Throttling)
- **File:** `server/middleware/rateLimiter.js`
- **Purpose:** Prevents spam, DoS attacks, and ensures fair resource allocation
- **Implementation:**
  - Feedback submission: 10 requests per hour per IP
  - General API: 100 requests per 15 minutes per IP
  - Uses `express-rate-limit` with IP-based key generation
  - Returns 429 status when exceeded
- **Benefits:** Prevents resource exhaustion, stops spam, ensures fairness

### ✅ Mechanism #2: Input Validation & Sanitization
- **File:** `server/middleware/validation.js`
- **Purpose:** Prevents injection attacks and maintains data integrity
- **Implementation:**
  - Email validation using `validator.isEmail()`
  - Content length constraints (2-5000 characters)
  - Category whitelisting
  - Rating range validation (1-5)
  - HTML entity encoding with `validator.escape()`
  - MongoDB injection prevention via `express-mongo-sanitize`
  - Duplicate submission detection within 1-hour window
- **Benefits:** Stops XSS, NoSQL injection, maintains data quality

## Edge Cases Handled

1. ✅ Concurrent submissions and duplicate detection
2. ✅ Malformed data types (string ratings, array emails, etc.)
3. ✅ Boundary conditions (empty content, oversized content)
4. ✅ Special characters and Unicode handling
5. ✅ Injection attack attempts (HTML, JS, NoSQL)
6. ✅ Pagination limits (capped at 50 items/page)
7. ✅ Missing required fields validation
8. ✅ IP spoofing considerations with proxy awareness
9. ✅ Very long email addresses handling
10. ✅ Emoji and RTL text support

## Known Limitations

1. ⚠️ IPv6 address limitations in corporate networks
2. ⚠️ VPN/Proxy users might bypass rate limiting by design
3. ⚠️ Duplicate detection only within 1-hour window
4. ⚠️ No user authentication system (anonymous submissions)
5. ⚠️ Email addresses not verified
6. ⚠️ CORS not configured for production domains
7. ⚠️ No encryption at rest (data stored plaintext in MongoDB)
8. ⚠️ In-memory rate limiter (resets on server restart)
9. ⚠️ Not designed for distributed systems (multiple servers)
10. ⚠️ No GDPR "right to be forgotten" mechanism

## Submission Details

- **Repository:** [GitHub URL - Will be added]
- **Live Demo:** [Deployment URL - Will be added]
- **Tech Stack:** React, Express.js, Node.js, MongoDB, Helmet.js
- **Fairness Mechanisms:** Rate Limiting + Input Validation/Sanitization
- **Documentation:** Complete in README.md and source code comments

---

For comprehensive documentation, see [README.md](./README.md)
