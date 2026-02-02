import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '@/utils/api';
import { UserPlus } from 'lucide-react';

export default function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/analyze';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      const token = res.data.token;
      localStorage.setItem('dev-helper-token', token);
      onRegister(token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
            Create Account
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: 'rgb(119, 119, 119)',
              letterSpacing: '-0.01em',
            }}
          >
            Join Dev Helper AI to start analyzing code
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: '#0d0d0d',
            borderRadius: '20px',
            padding: '40px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username Field */}
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
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={30}
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
              />
            </div>

            {/* Email Field */}
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
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
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
              />
            </div>

            {/* Password Field */}
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
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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
              />
            </div>

            {/* Confirm Password Field */}
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
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
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
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(153, 27, 27, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: '1px solid rgb(127, 29, 29)',
                }}
              >
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgb(248, 113, 113)', margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '9999px',
                backgroundColor: loading ? 'rgb(39, 39, 42)' : 'rgb(25, 25, 25)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                opacity: loading ? 0.5 : 1,
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgb(25, 25, 25)';
                  e.target.style.color = 'white';
                }
              }}
            >
              <UserPlus style={{ width: 18, height: 18 }} />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: 'rgb(119, 119, 119)',
            }}
          >
            Already have an account?{' '}
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
    </div>
  );
}
