import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import Statistics from './components/Statistics';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('feedback');

  // Fetch feedback
  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/feedback');
      setFeedback(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching feedback');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, []);

  // Handle feedback submission
  const handleFeedbackSubmitted = () => {
    setSuccessMessage('Thank you! Your feedback has been submitted successfully.');
    setTimeout(() => setSuccessMessage(null), 5000);
    fetchFeedback();
    fetchStats();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>💬 Feedback Hub</h1>
          <p>A fair community feedback platform with anti-abuse mechanisms</p>
        </div>
      </header>

      <main className="main-container">
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            📝 Submit Feedback
          </button>
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 View All ({feedback.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'feedback' && (
            <section className="section">
              <FeedbackForm onSubmitted={handleFeedbackSubmitted} />
            </section>
          )}

          {activeTab === 'list' && (
            <section className="section">
              <div className="section-header">
                <h2>All Feedback</h2>
                <button 
                  className="refresh-btn"
                  onClick={fetchFeedback}
                  disabled={loading}
                >
                  {loading ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
              </div>
              {loading ? (
                <div className="loading">Loading feedback...</div>
              ) : feedback.length > 0 ? (
                <FeedbackList feedback={feedback} />
              ) : (
                <div className="empty-state">No feedback yet. Be the first to share!</div>
              )}
            </section>
          )}

          {activeTab === 'stats' && (
            <section className="section">
              <div className="section-header">
                <h2>Feedback Statistics</h2>
              </div>
              <Statistics stats={stats} />
            </section>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          🛡️ <strong>Fairness & Anti-Abuse Mechanisms:</strong> Rate limiting per IP • Input validation & sanitization
        </p>
        <p>
          This platform enforces fairness through rate limiting (10 submissions/hour per IP) and comprehensive input validation to prevent abuse.
        </p>
      </footer>
    </div>
  );
}

export default App;
