import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaCheckCircle, FaHistory, FaChartLine } from 'react-icons/fa';
import TrustBadge from './TrustBadge';

const TrustManagement = ({ userId, onUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [action, setAction] = useState('ADMIN_BONUS');
  const [reason, setReason] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const actions = [
    { value: 'ADMIN_BONUS', label: 'Admin Bonus', points: 20 },
    { value: 'ADMIN_PENALTY', label: 'Admin Penalty', points: -20 },
    { value: 'POSITIVE_REVIEW', label: 'Positive Review', points: 5 },
    { value: 'SMOOTH_TRANSACTION', label: 'Smooth Transaction', points: 3 },
    { value: 'LISTING_REPORTED', label: 'Listing Reported', points: -15 },
    { value: 'COMPLAINT_VERIFIED', label: 'Complaint Verified', points: -10 }
  ];

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trust/seller/${userId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustHistory = async () => {
    try {
      const response = await fetch(`/api/trust/${userId}/history`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trust history');
      }

      const data = await response.json();
      setHistory(data.data.history);
    } catch (error) {
      console.error('Error fetching trust history:', error);
    }
  };

  const handleUpdatePoints = async (e) => {
    e.preventDefault();
    
    if (!points || !action) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/trust/${userId}/points`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: parseInt(points),
          action,
          reason: reason || actions.find(a => a.value === action)?.label
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update trust points');
      }

      const data = await response.json();
      setUser(data.data);
      setPoints(0);
      setReason('');
      
      if (onUpdate) {
        onUpdate(data.data);
      }

      alert('Trust points updated successfully!');
    } catch (error) {
      console.error('Error updating trust points:', error);
      alert('Failed to update trust points');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (actionType, pointsValue) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trust/${userId}/points`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: pointsValue,
          action: actionType,
          reason: actions.find(a => a.value === actionType)?.label
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update trust points');
      }

      const data = await response.json();
      setUser(data.data);
      
      if (onUpdate) {
        onUpdate(data.data);
      }
    } catch (error) {
      console.error('Error updating trust points:', error);
      alert('Failed to update trust points');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-red-500">User not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* User Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.username}</h3>
            <TrustBadge seller={user} size="sm" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{user.trustPoints}</div>
          <div className="text-sm text-gray-600">Trust Points</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('ADMIN_BONUS', 20)}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200"
            disabled={loading}
          >
            <FaPlus className="w-3 h-3" />
            <span>+20 Bonus</span>
          </button>
          <button
            onClick={() => handleQuickAction('ADMIN_PENALTY', -20)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
            disabled={loading}
          >
            <FaMinus className="w-3 h-3" />
            <span>-20 Penalty</span>
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
          >
            <FaHistory className="w-3 h-3" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Custom Points Update */}
      <form onSubmit={handleUpdatePoints} className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Custom Points Update</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Points
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter points"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {actions.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label} ({action.points > 0 ? '+' : ''}{action.points})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Custom reason (optional)"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Points'}
        </button>
      </form>

      {/* Trust History */}
      {showHistory && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Trust History</h4>
          <div className="max-h-60 overflow-y-auto">
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${entry.points > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <div>
                        <div className="font-medium text-gray-900">{entry.reason}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className={`font-bold ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.points > 0 ? '+' : ''}{entry.points}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No trust history available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustManagement;
