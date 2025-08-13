import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const signup = useChatStore((s) => s.signup);
  const authLoading = useChatStore((s) => s.authLoading);
  const authMessage = useChatStore((s) => s.authMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }
      await signup(email, password);
      setMessage('Account created. Please check your email for the verification code.');
      navigate(ROUTES.VERIFY, { state: { username: email } });
    } catch (e: any) {
      setMessage(e?.message || 'Sign up failed');
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create a new account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Creating…' : 'Create account'}
            </Button>
          </form>
          {!!message && <p className="mt-3 text-sm">{message}</p>}
          {!!authMessage && <p className="mt-2 text-xs text-blue-600">{authMessage}</p>}
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link className="underline" to={ROUTES.LOGIN}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
