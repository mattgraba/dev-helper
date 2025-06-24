// components/HistoryPanel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../redux/historySlice';

export default function HistoryPanel() {
    const dispatch = useDispatch();
    const { data: history, loading, error } = useSelector((state) => state.history);
  
    useEffect(() => {
      dispatch(fetchHistory());
    }, [dispatch]);

  if (loading) return <p className="text-gray-500 italic">🔄 Loading history...</p>;
  if (error) return <p className="text-red-600">⚠️ {error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">AI Analysis History</h2>
      <ul className="space-y-3">
        {history.map((entry, idx) => (
          <li key={idx} className="p-3 border rounded bg-gray-50">
            <p><strong>Prompt:</strong> {entry.prompt}</p>
            <p><strong>AI Response:</strong> {entry.aiResponse}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
