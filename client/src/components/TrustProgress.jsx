import React from 'react';

const TrustProgress = ({ trustPoints, showLevel = true, size = 'md' }) => {
  if (trustPoints === undefined || trustPoints === null) return null;

  const getLevelInfo = (points) => {
    if (points >= 100) return { level: 'Platinum', emoji: '💎', color: 'purple', maxPoints: 100 };
    if (points >= 61) return { level: 'Gold', emoji: '🥇', color: 'yellow', maxPoints: 100 };
    if (points >= 31) return { level: 'Silver', emoji: '🥈', color: 'gray', maxPoints: 60 };
    return { level: 'Bronze', emoji: '🥉', color: 'orange', maxPoints: 30 };
  };

  const levelInfo = getLevelInfo(trustPoints);
  const progressPercentage = Math.min(100, (trustPoints / levelInfo.maxPoints) * 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full">
      {showLevel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{levelInfo.emoji}</span>
            <span className="font-medium text-gray-700">{levelInfo.level}</span>
          </div>
          <span className="text-sm text-gray-600">{trustPoints} pts</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${colorClasses[levelInfo.color]}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {showLevel && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{levelInfo.maxPoints}</span>
        </div>
      )}
    </div>
  );
};

export default TrustProgress;
