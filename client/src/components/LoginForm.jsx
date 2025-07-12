import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/utils/api';

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
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Log In</Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}