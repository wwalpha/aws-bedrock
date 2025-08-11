import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Verify() {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location?.state?.username) {
      setUsername(location.state.username as string);
    }
  }, [location?.state?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/confirmSignup`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, confirmationCode: code }),
      });
      if (!res.ok) {
        const msg = (await res.text()) || 'Verification failed';
        setMessage(msg);
        return;
      }
      setMessage('Verification successful. You can now log in.');
      navigate(ROUTES.LOGIN);
    } catch (e: any) {
      setMessage(e?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Verify account</CardTitle>
          <CardDescription>Enter the verification code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="border-input bg-background focus-visible:ring-ring rounded-md border p-2 focus-visible:outline-none focus-visible:ring-2"
              type="text"
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify'}
            </Button>
          </form>
          {!!message && <p className="mt-3 text-sm">{message}</p>}
          <p className="mt-4 text-center text-sm">
            Didn’t receive a code?{' '}
            <Link className="underline" to={ROUTES.SIGNUP}>
              Go back
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
