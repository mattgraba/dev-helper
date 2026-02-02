import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">
              Join Dev Helper AI to start analyzing code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <Input
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 transition"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={30}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <Input
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 transition"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <Input
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 transition"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <Input
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 transition"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
