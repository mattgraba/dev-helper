import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import { LogInIcon } from "lucide-react";

export default function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the page they were trying to access, default to /analyze
    const from = location.state?.from || '/analyze';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { username, password });
            const token = res.data.token;
            localStorage.setItem('dev-helper-token', token);
            onLoginSuccess(token);
            // Redirect to the page they were trying to access
            navigate(from, { replace: true });
          } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
          } finally {
            setLoading(false);
          }
        };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <Card className="w-full max-w-md shadow-xl">
            <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Login to Dev Helper AI</h1>
              <p className="text-gray-400 text-sm mt-2">
                Enter your credentials to continue
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
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LogInIcon className="w-5 h-5" />
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:underline">
                Register here
              </Link>
            </div>
            </CardContent>
        </Card>
        </div>
    );
}
