import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const login = useAppStore((s) => s.login);
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
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-black text-white p-2 rounded" type="submit">
          Sign in
        </button>
      </form>
      {!!message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}
