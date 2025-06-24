// components/HistoryPanel.jsx
import React, { useEffect, useState } from 'react';
import { useHistory } from '../context/HistoryContext';

export default function HistoryPanel() {
  const { history, setHistory, loading, setLoading } = useHistory();
  const [error, setError] = useState(null);

  // Hardcoded userId for now — replace with real user info later
  const userId = 'test-user-1';

  useEffect(() => {
    fetch('http://localhost:3001/history')  // 👈 API call to backend
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch history');
        return res.json();                  // Parse the JSON response
      })
      .then(data => {
        setHistory(data);                   // Save data to state
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load history');
        setLoading(false);
      });
  }, [userId]);

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
