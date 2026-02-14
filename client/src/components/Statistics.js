import React from 'react';
import './Statistics.css';

function Statistics({ stats }) {
  if (!stats || stats.length === 0) {
    return <div className="no-stats">No statistics available yet.</div>;
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'feature': '🚀',
      'bug': '🐛',
      'improvement': '⚡',
      'other': '💬'
    };
    return icons[category] || '💬';
  };

  const maxCount = Math.max(...stats.map(s => s.count));

  return (
    <div className="statistics">
      {stats.map((stat) => (
        <div key={stat._id} className="stat-card">
          <div className="stat-header">
            <h3>
              {getCategoryIcon(stat._id)} {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
            </h3>
          </div>

          <div className="stat-content">
            <div className="stat-item">
              <span className="stat-label">Total Feedback:</span>
              <span className="stat-value">{stat.count}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Average Rating:</span>
              <span className="stat-value">
                {stat.avgRating.toFixed(2)} ⭐
              </span>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(stat.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}

      <div className="total-stats">
        <div className="total-card">
          <h3>Total Feedback Received</h3>
          <p className="total-count">{stats.reduce((sum, s) => sum + s.count, 0)}</p>
        </div>

        <div className="avg-card">
          <h3>Overall Average Rating</h3>
          <p className="avg-rating">
            {(stats.reduce((sum, s) => sum + (s.avgRating * s.count), 0) / stats.reduce((sum, s) => sum + s.count, 0)).toFixed(2)} ⭐
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
