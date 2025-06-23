import React, { useState } from 'react';

function ErrorInputForm() {
  const [errorText, setErrorText] = useState("");
  const [response, setResponse] = useState("");     // [response] State & Display: Store and show the AI-generated explanation and fix for the error.
  const [loading, setLoading] = useState(false);    // [loading] State: Show the user that a background process (fetching AI response) is in progress.
  const [error, setError] = useState(null);         // [error] Handling: Gracefully handle and communicate any issues from the backend (e.g. 500 Internal Server Error).

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

      // [error] Handling: In handleSubmit()
      if (!res.ok) {
        if (res.status === 500) {
          throw new Error('Internal Server Error: Failed to analyze the error.');
        } else {
          throw new Error(`Unexpected error: ${res.status}`);
        }
      }

      // [response] State & Display: Set after a successful fetch
      const data = await res.json();
      setResponse(data.response);

      // [error] Handling: If an error is thrown
    } catch (err) {
      console.error("Error during fetch:", err);    // Error Logging with console.error()
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
        {/* Button Disabled During Fetch: Prevent duplicate submits while a request is pending */}
        <button type="submit" disabled={loading}>
          {loading ? '⏳ Analyzing...' : 'Analyze Error'}
        </button>
      </form>

      {/* [error] Handling: Displayed in UI */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {/* Show loading message */}
      {loading && <p>Waiting for AI response...</p>}

      {/* [response] State & Display: Rendered in the UI (Show AI response)*/}
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