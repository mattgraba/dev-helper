import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{ width: '480px', maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontFamily: 'Inter Variable, Inter, sans-serif',
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              color: 'rgb(255, 255, 255)',
              marginBottom: '12px',
            }}
          >
            Forgot Password?
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(119, 119, 119)',
              letterSpacing: '-0.01em',
            }}
          >
            No worries, we'll help you reset it
          </p>
        </div>

        {/* Info Card */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
            {/* Icon */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgb(25, 25, 25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail style={{ width: 32, height: 32, color: 'rgb(168, 85, 247)' }} />
            </div>

            {/* Message */}
            <div>
              <h2
                style={{
                  fontFamily: 'Inter Variable, Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: 'rgb(255, 255, 255)',
                  marginBottom: '12px',
                }}
              >
                Contact Support
              </h2>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'rgb(161, 161, 170)',
                  lineHeight: '1.6',
                  marginBottom: '8px',
                }}
              >
                To reset your password, please contact our support team at:
              </p>
              <a
                href="mailto:support@devhelper.com"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'rgb(168, 85, 247)',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              >
                support@devhelper.com
              </a>
            </div>

            {/* Alternative */}
            <div
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgb(200, 200, 200)',
                  margin: 0,
                  lineHeight: '1.5',
                }}
              >
                <strong>Tip:</strong> Include your username or email in your message for faster assistance.
              </p>
            </div>

            {/* Back to Login Button */}
            <Link
              to="/login"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '9999px',
                backgroundColor: 'rgb(25, 25, 25)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgb(25, 25, 25)';
                e.target.style.color = 'white';
              }}
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div
          style={{
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgb(119, 119, 119)',
          }}
        >
          Remember your password?{' '}
          <Link
            to="/login"
            style={{
              color: 'rgb(168, 85, 247)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onMouseOver={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
