import React, { useState } from 'react';

const FraudDetectionDetails = ({ fraudDetection, listingId, onRetest }) => {
    const [isRetesting, setIsRetesting] = useState(false);

    if (!fraudDetection) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-600">AI fraud detection not yet performed</span>
                    </div>
                    {onRetest && (
                        <button
                            onClick={() => onRetest(listingId)}
                            disabled={isRetesting}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isRetesting ? 'Testing...' : 'Run Detection'}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const { fraudScore, isFraudulent, anomalyScore, detectedAt, fraudFeatures } = fraudDetection;

    const handleRetest = async () => {
        if (onRetest) {
            setIsRetesting(true);
            try {
                await onRetest(listingId);
            } finally {
                setIsRetesting(false);
            }
        }
    };

    return (
        <div className={`border rounded-lg p-4 ${isFraudulent ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <svg className={`w-5 h-5 mr-2 ${isFraudulent ? 'text-red-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        {isFraudulent ? (
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        )}
                    </svg>
                    <span className={`font-medium ${isFraudulent ? 'text-red-800' : 'text-green-800'}`}>
                        {isFraudulent ? 'Suspicious Listing Detected' : 'Verified by AI'}
                    </span>
                </div>
                {onRetest && (
                    <button
                        onClick={handleRetest}
                        disabled={isRetesting}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isRetesting ? 'Retesting...' : 'Retest'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-medium text-gray-700">Fraud Score:</span>
                    <span className={`ml-2 font-bold ${isFraudulent ? 'text-red-600' : 'text-green-600'}`}>
                        {fraudScore ? `${fraudScore.toFixed(1)}%` : 'N/A'}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Anomaly Score:</span>
                    <span className="ml-2 text-gray-600">
                        {anomalyScore ? anomalyScore.toFixed(4) : 'N/A'}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 font-medium ${isFraudulent ? 'text-red-600' : 'text-green-600'}`}>
                        {isFraudulent ? 'Suspicious' : 'Verified'}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-gray-700">Detected:</span>
                    <span className="ml-2 text-gray-600">
                        {detectedAt ? new Date(detectedAt).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>

            {fraudFeatures && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Analysis Details:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>Price/Sqm: {fraudFeatures.pricePerSqm?.toFixed(4) || 'N/A'}</div>
                        <div>Area Norm: {fraudFeatures.areaNormalized?.toFixed(4) || 'N/A'}</div>
                        <div>Bedrooms Norm: {fraudFeatures.bedroomsNormalized?.toFixed(4) || 'N/A'}</div>
                        <div>City Tier: {fraudFeatures.cityTier?.toFixed(4) || 'N/A'}</div>
                    </div>
                </div>
            )}

            {isFraudulent && (
                <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                    <strong>Warning:</strong> This listing has been flagged as potentially fraudulent based on AI analysis. 
                    Please verify the details before proceeding.
                </div>
            )}
        </div>
    );
};

export default FraudDetectionDetails;





