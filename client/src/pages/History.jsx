import { useState, useEffect } from 'react';
import { Clock, Code, FileText } from 'lucide-react';
import api from '@/utils/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('dev-helper-token');
      const res = await api.get('/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCommandIcon = (command) => {
    switch (command) {
      case 'analyze':
      case 'fix':
        return <Code style={{ width: 18, height: 18, color: 'rgb(248, 113, 113)' }} />;
      case 'generate':
      case 'scaffold':
        return <FileText style={{ width: 18, height: 18, color: 'rgb(74, 222, 128)' }} />;
      case 'explain':
        return <FileText style={{ width: 18, height: 18, color: 'rgb(96, 165, 250)' }} />;
      case 'terminal':
        return <Code style={{ width: 18, height: 18, color: 'rgb(168, 85, 247)' }} />;
      default:
        return <FileText style={{ width: 18, height: 18, color: 'rgb(161, 161, 170)' }} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(161, 161, 170)',
            }}
          >
            Loading your history...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div
            style={{
              backgroundColor: 'rgba(153, 27, 27, 0.2)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgb(127, 29, 29)',
            }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgb(248, 113, 113)', margin: 0 }}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            <Clock style={{ width: 32, height: 32, color: 'rgb(168, 85, 247)' }} />
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
              Command History
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
            View all your past AI-assisted commands and responses. Your command history is saved
            to help you track your development workflow.
          </p>
        </div>

        {history.length === 0 ? (
          <div
            style={{
              backgroundColor: '#0d0d0d',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: 'rgb(161, 161, 170)',
                margin: 0,
              }}
            >
              No command history yet. Start using the CLI or Web App to build your history!
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {history.map((entry, index) => (
                <div
                  key={entry._id || index}
                  style={{
                    backgroundColor: '#0d0d0d',
                    borderRadius: '20px',
                    padding: '32px',
                    border: '1px solid transparent',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(39, 39, 42)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getCommandIcon(entry.command)}
                      <span
                        style={{
                          fontFamily: 'Inter Variable, Inter, sans-serif',
                          fontSize: '18px',
                          fontWeight: 600,
                          letterSpacing: '-0.01em',
                          color: 'rgb(255, 255, 255)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {entry.command}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgb(119, 119, 119)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock style={{ width: 14, height: 14 }} />
                      {formatDate(entry.createdAt || entry.timestamp)}
                    </span>
                  </div>

                  {/* Input */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'rgb(161, 161, 170)',
                        marginBottom: '8px',
                      }}
                    >
                      Input:
                    </h3>
                    <pre
                      style={{
                        backgroundColor: 'rgb(9, 9, 11)',
                        color: 'rgb(200, 200, 200)',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: '128px',
                        overflowY: 'auto',
                        margin: 0,
                        border: '1px solid rgb(39, 39, 42)',
                      }}
                    >
                      {entry.input}
                    </pre>
                  </div>

                  {/* Output */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'rgb(161, 161, 170)',
                        marginBottom: '8px',
                      }}
                    >
                      Output:
                    </h3>
                    <pre
                      style={{
                        backgroundColor: 'rgb(9, 9, 11)',
                        color: 'rgb(200, 200, 200)',
                        padding: '16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                        maxHeight: '192px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                        border: '1px solid rgb(39, 39, 42)',
                      }}
                    >
                      {entry.output}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                textAlign: 'center',
                marginTop: '40px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgb(119, 119, 119)',
              }}
            >
              Showing {history.length} command{history.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
