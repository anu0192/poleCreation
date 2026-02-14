import React from 'react';
import './FeedbackList.css';

function FeedbackList({ feedback }) {
  const getCategoryIcon = (category) => {
    const icons = {
      'feature': '🚀',
      'bug': '🐛',
      'improvement': '⚡',
      'other': '💬'
    };
    return icons[category] || '💬';
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="feedback-list">
      {feedback.map((item) => (
        <div key={item._id} className="feedback-card">
          <div className="feedback-header">
            <div className="feedback-meta">
              <span className="category-badge">
                {getCategoryIcon(item.category)} {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>
              <span className="rating-badge">
                {getRatingStars(item.rating)}
              </span>
            </div>
            <span className="date">{formatDate(item.createdAt)}</span>
          </div>

          <p className="feedback-content">{item.content}</p>

          <div className="feedback-footer">
            <span className="email-badge">
              ✉️ {item.email}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeedbackList;
