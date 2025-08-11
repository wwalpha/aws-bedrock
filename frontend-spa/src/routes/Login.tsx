import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const login = useChatStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const result = await login(email, password);
    if ('error' in result) {
      setMessage(result.error || 'Login failed');
      return;
    }
    setMessage('Logged in');
    // Navigate to home (or dashboard) after successful login
    navigate('/');
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in with your email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          {!!message && <p className="mt-3 text-sm">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
