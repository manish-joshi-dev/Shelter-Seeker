import React from 'react';
import { FaCheckCircle, FaStar, FaMedal } from 'react-icons/fa';

const TrustBadge = ({ seller, size = 'md', showDetails = false }) => {
  if (!seller) return null;

  const { trustPoints, rating, verifiedSeller, sellerLevel } = seller;

  // Get seller level info
  const getLevelInfo = (points) => {
    if (points >= 100) return { level: 'Platinum', emoji: '💎', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-800' };
    if (points >= 61) return { level: 'Gold', emoji: '🥇', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    if (points >= 31) return { level: 'Silver', emoji: '🥈', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    return { level: 'Bronze', emoji: '🥉', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
  };

  const levelInfo = getLevelInfo(trustPoints || 0);
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${sizeClasses[size]}`}>
      {/* Verified Badge */}
      {verifiedSeller && (
        <div className="flex items-center space-x-1 text-green-600">
          <FaCheckCircle className="w-4 h-4" />
          <span className="font-semibold">Verified</span>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center space-x-1">
        <FaStar className="w-4 h-4 text-yellow-500" />
        <span className="font-medium">{rating || 0}/5</span>
      </div>

      {/* Seller Level */}
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${levelInfo.bgColor} ${levelInfo.textColor}`}>
        <span className="text-sm">{levelInfo.emoji}</span>
        <span className="text-xs font-medium">{levelInfo.level}</span>
      </div>

      {/* Trust Points (if showDetails is true) */}
      {showDetails && (
        <div className="text-xs text-gray-600">
          {trustPoints || 0} pts
        </div>
      )}
    </div>
  );
};

export default TrustBadge;
