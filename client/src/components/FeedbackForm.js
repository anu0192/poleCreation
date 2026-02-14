import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';

function FeedbackForm({ onSubmitted }) {
  const [formData, setFormData] = useState({
    email: '',
    category: 'feature',
    content: '',
    rating: 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/feedback', formData);
      
      // Reset form
      setFormData({
        email: '',
        category: 'feature',
        content: '',
        rating: 5
      });

      onSubmitted();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error submitting feedback. Please try again.';
      setError(errorMsg);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>Share Your Feedback</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="feature">🚀 Feature Request</option>
            <option value="bug">🐛 Bug Report</option>
            <option value="improvement">⚡ Improvement</option>
            <option value="other">💬 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating *</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐⭐ 2 - Fair</option>
            <option value="3">⭐⭐⭐ 3 - Good</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="content">Feedback Message *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          minLength="2"
          maxLength="5000"
          placeholder="Share your detailed feedback here... (2-5000 characters)"
          rows="5"
        />
        <div className="char-count">
          {formData.content.length} / 5000 characters
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={loading}
      >
        {loading ? '⏳ Submitting...' : '📤 Submit Feedback'}
      </button>

      <div className="info-box">
        <p>
          <strong>⏱️ Rate Limiting:</strong> You can submit up to 10 feedbacks per hour from your IP address.
        </p>
        <p>
          <strong>🛡️ Security:</strong> All inputs are validated and sanitized to ensure platform safety.
        </p>
      </div>
    </form>
  );
}

export default FeedbackForm;
