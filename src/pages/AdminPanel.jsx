import React, { useEffect, useState } from "react";
import { fetchPendingUsers, approveUser } from "../services/api";
import "../styles/adminPanel.css";

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    const loadPendingUsers = async () => {
      try {
        setLoading(true);
        const res = await fetchPendingUsers();
        setPendingUsers(res.data);
      } catch (error) {
        console.error("Error loading pending users:", error);
        alert("Failed to load pending users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadPendingUsers();
  }, []);

  const handleApproval = async (userId, action) => {
    try {
      setProcessing(prev => ({ ...prev, [userId]: true }));
      await approveUser(userId, action);
      
      // Remove user from pending list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      alert(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setProcessing(prev => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading pending users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel - User Approval</h2>
        <p>Review and approve pending user registrations</p>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{pendingUsers.length}</div>
          <div className="stat-label">Pending Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {pendingUsers.filter(user => user.approval_status === 'Pending').length}
          </div>
          <div className="stat-label">Awaiting Review</div>
        </div>
      </div>

      <div className="users-section">
        <h3>Pending User Registrations</h3>
        
        {pendingUsers.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">✅</div>
            <h3>All caught up!</h3>
            <p>No pending user registrations at the moment.</p>
          </div>
        ) : (
          <div className="users-grid">
            {pendingUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4>
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user.username}
                    </h4>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${user.approval_status.toLowerCase()}`}>
                      {user.approval_status}
                    </span>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-row">
                    <span className="label">Username:</span>
                    <span className="value">{user.username}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{user.phone}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Registered:</span>
                    <span className="value">{formatDate(user.date_joined)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Last Login:</span>
                    <span className="value">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="user-actions">
                  <button
                    onClick={() => handleApproval(user.id, 'approve')}
                    disabled={processing[user.id]}
                    className="action-btn approve"
                  >
                    {processing[user.id] ? (
                      <>
                        <div className="spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        ✅ Approve User
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleApproval(user.id, 'reject')}
                    disabled={processing[user.id]}
                    className="action-btn reject"
                  >
                    {processing[user.id] ? (
                      <>
                        <div className="spinner"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        ❌ Reject User
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
