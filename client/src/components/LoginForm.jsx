import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';
import { LogInIcon } from "lucide-react";

export default function LoginForm({ onLoginSuccess }) {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post('/auth/login', { userId });
            const token = res.data.token;
            localStorage.setItem('dev-helper-token', token);
            onLoginSuccess(token);
          } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
          }
        };
      
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
            <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-center">Login to Dev Helper AI</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-400 transition"
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2">
                    <LogInIcon className="w-5 h-5" />
                    Login
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}