import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TEMP: bypass auth checks and go to post-login screen
    // TODO: restore real login flow
    navigate(ROUTES.WORKSPACE);
  };

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="mx-auto">
          <ChatbotUISVG scale={0.25} />
        </div>

        <Label className="text-md mt-4" htmlFor="login-email">
          Email
        </Label>
        <Input
          id="login-email"
          className="mb-3 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label className="text-md" htmlFor="login-password">
          Password
        </Label>
        <Input
          id="login-password"
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="mb-2 rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-700/90">
          Login
        </Button>

        {/* TEMP: suppress error display while bypassing auth */}
      </form>

      <div className="text-muted-foreground mt-3 flex justify-center text-sm">
        <span className="mr-1">Forgot your password?</span>
        <button className="text-primary ml-1 underline hover:opacity-80" type="button">
          Reset
        </button>
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Link
          to={ROUTES.SIGNUP}
          className="border-foreground/20 rounded-md border px-4 py-2 text-center hover:opacity-80"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
