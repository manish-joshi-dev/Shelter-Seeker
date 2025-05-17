import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFlag, FaTimes } from 'react-icons/fa';

const ReportListing = ({ listingId, onClose }) => {
  const { curUser } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const [reportData, setReportData] = useState({
    reason: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'fake', label: 'Fake Listing' },
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'misleading', label: 'Misleading Information' },
    { value: 'duplicate', label: 'Duplicate Listing' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!curUser) {
      alert('Please sign in to report a listing');
      return;
    }

    if (!reportData.reason || !reportData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          listingId,
          reason: reportData.reason,
          description: reportData.description,
        }),
      });

      if (res.ok) {
        alert('Report submitted successfully');
        setShowForm(false);
        setReportData({ reason: '', description: '' });
        onClose();
      } else {
        const data = await res.json();
        alert('Failed to submit report: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm"
      >
        <FaFlag className="h-4 w-4" />
        <span>Report</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Report Listing</h3>
          <button
            onClick={() => {
              setShowForm(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting *
            </label>
            <select
              value={reportData.reason}
              onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason</option>
              {reasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional details *
            </label>
            <textarea
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              placeholder="Please provide more details about why you're reporting this listing..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-400 flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                onClose();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportListing;

