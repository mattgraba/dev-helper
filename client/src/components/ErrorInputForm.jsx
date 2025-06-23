import React, { useState } from 'react';

function ErrorInputForm() {
  const [errorText, setErrorText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errorText }),
      });

      if (!res.ok) {
        // Specifically handle 500 error
        if (res.status === 500) {
          throw new Error('Internal Server Error: Failed to analyze the error.');
        } else {
          throw new Error(`Unexpected error: ${res.status}`);
        }
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error("Error during fetch:", err);
      setError(err.message || 'Failed to analyze the error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Error Input Form</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
          rows={10}
          cols={60}
          placeholder="Paste your error here..."
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Analyzing...' : 'Analyze Error'}
        </button>
      </form>

      {/* Show error message */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {/* Show loading message */}
      {loading && <p>Waiting for AI response...</p>}

      {/* Show AI response */}
      {response && !loading && (
        <div style={{ marginTop: '1rem' }}>
          <h3>AI Response:</h3>
          <pre style={{
            background: '#f0f0f0',
            padding: '1em',
            borderRadius: '6px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.5'
          }}>
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ErrorInputForm