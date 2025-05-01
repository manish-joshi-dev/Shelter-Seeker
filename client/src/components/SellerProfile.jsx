import React, { useState, useEffect } from 'react';
import { FaStar, FaCheckCircle, FaMedal, FaHistory, FaChartLine } from 'react-icons/fa';
import TrustBadge from './TrustBadge';
import TrustProgress from './TrustProgress';

const SellerProfile = ({ sellerId, showFullProfile = false }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/trust/seller/${sellerId}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch seller profile');
        }

        const data = await response.json();
        setSeller(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchSellerProfile();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="text-red-500 text-sm">
        {error || 'Seller not found'}
      </div>
    );
  }

  const { 
    username, 
    avatar, 
    trustPoints, 
    rating, 
    verifiedSeller, 
    sellerLevel, 
    sellerStats,
    trustHistory,
    joinedAt,
    lastActivity
  } = seller;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={avatar || '/default-avatar.png'}
          alt={username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{username}</h3>
          <TrustBadge seller={seller} size="sm" />
        </div>
      </div>

      {/* Trust Progress */}
      <div className="mb-4">
        <TrustProgress trustPoints={trustPoints} showLevel={true} size="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{sellerStats.listingsCount}</div>
          <div className="text-sm text-gray-600">Listings</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{sellerStats.positiveReviews}</div>
          <div className="text-sm text-gray-600">Reviews</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{sellerStats.totalTransactions}</div>
          <div className="text-sm text-gray-600">Transactions</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{rating}/5</div>
          <div className="text-sm text-gray-600">Rating</div>
        </div>
      </div>

      {/* Full Profile Details */}
      {showFullProfile && (
        <div className="space-y-4">
          {/* Seller Level Details */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Seller Level</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{sellerLevel.emoji}</span>
              <div>
                <div className="font-medium text-gray-900">{sellerLevel.level}</div>
                <div className="text-sm text-gray-600">{trustPoints} trust points</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {trustHistory && trustHistory.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recent Activity</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {trustHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${entry.points > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-gray-700">{entry.reason}</span>
                    </div>
                    <span className={`font-medium ${entry.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {entry.points > 0 ? '+' : ''}{entry.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Date */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Joined:</span> {new Date(joinedAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Last Active:</span> {new Date(lastActivity).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
