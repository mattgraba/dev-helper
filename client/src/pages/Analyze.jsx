import { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import api from '@/utils/api';

export default function AnalyzePage() {
  const [errorText, setErrorText] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [explanation, setExplanation] = useState('');
  const [fix, setFix] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExplanation('');
    setFix('');
    setLoading(true);

    try {
      const token = localStorage.getItem('dev-helper-token');
      const res = await api.post(
        '/analyze',
        { errorText, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExplanation(res.data.explanation || '');
      setFix(res.data.fix || res.data.fixedCode || '');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
      }}
    >
      <div style={{ width: '960px', maxWidth: '100%' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Sparkles style={{ width: 32, height: 32, color: 'rgb(168, 85, 247)' }} />
            <h1
              style={{
                fontFamily: 'Inter Variable, Inter, sans-serif',
                fontSize: '48px',
                fontWeight: 700,
                letterSpacing: '-0.05em',
                color: 'rgb(255, 255, 255)',
                margin: 0,
              }}
            >
              Code Analysis
            </h1>
          </div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              color: 'rgb(119, 119, 119)',
              lineHeight: '1.6',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            Paste your buggy code below and let AI help you understand and fix the issues.
            Get instant explanations and suggested fixes powered by GPT-4.
          </p>
        </div>

        {/* Input Form */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Language Selector */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'rgb(200, 200, 200)',
                  marginBottom: '8px',
                }}
              >
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgb(9, 9, 11)',
                  color: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(39, 39, 42)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                }}
              >
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
                <option value="PHP">PHP</option>
                <option value="Ruby">Ruby</option>
              </select>
            </div>

            {/* Code Input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'rgb(200, 200, 200)',
                  marginBottom: '8px',
                }}
              >
                Your Code
              </label>
              <textarea
                value={errorText}
                onChange={(e) => setErrorText(e.target.value)}
                placeholder="Paste your buggy code here..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgb(9, 9, 11)',
                  color: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(39, 39, 42)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !errorText.trim()}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '9999px',
                backgroundColor: loading || !errorText.trim() ? 'rgb(39, 39, 42)' : 'rgb(25, 25, 25)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: loading || !errorText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: loading || !errorText.trim() ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading && errorText.trim()) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && errorText.trim()) {
                  e.target.style.backgroundColor = 'rgb(25, 25, 25)';
                  e.target.style.color = 'white';
                }
              }}
            >
              <Sparkles style={{ width: 18, height: 18 }} />
              {loading ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(153, 27, 27, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              border: '1px solid rgb(127, 29, 29)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle style={{ width: 20, height: 20, color: 'rgb(248, 113, 113)', flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgb(248, 113, 113)', margin: 0 }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {(explanation || fix) && (
          <>
            {/* Explanation */}
            {explanation && (
              <div
                style={{
                  backgroundColor: '#0d0d0d',
                  borderRadius: '20px',
                  padding: '40px',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Inter Variable, Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'rgb(255, 255, 255)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertCircle style={{ width: 22, height: 22, color: 'rgb(251, 191, 36)' }} />
                  Explanation
                </h2>
                <div
                  style={{
                    backgroundColor: 'rgb(9, 9, 11)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgb(39, 39, 42)',
                  }}
                >
                  <pre
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: 'rgb(200, 200, 200)',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                      lineHeight: '1.6',
                    }}
                  >
                    {explanation}
                  </pre>
                </div>
              </div>
            )}

            {/* Suggested Fix */}
            {fix && (
              <div
                style={{
                  backgroundColor: '#0d0d0d',
                  borderRadius: '20px',
                  padding: '40px',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Inter Variable, Inter, sans-serif',
                    fontSize: '24px',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'rgb(255, 255, 255)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <CheckCircle style={{ width: 22, height: 22, color: 'rgb(74, 222, 128)' }} />
                  Suggested Fix
                </h2>
                <div
                  style={{
                    backgroundColor: 'rgb(9, 9, 11)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid rgb(39, 39, 42)',
                  }}
                >
                  <pre
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: 'rgb(74, 222, 128)',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                      overflowX: 'auto',
                    }}
                  >
                    {fix}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
