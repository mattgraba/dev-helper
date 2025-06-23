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
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the error. Please try again.');
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
          {loading ? 'Analyzing...' : 'Analyze Error'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div>
          <h3>AI Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default ErrorInputForm;