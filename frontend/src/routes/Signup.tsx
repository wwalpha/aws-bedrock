import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store';

// --- Signup Route: アカウント新規作成フォーム ---
// 役割:
// - ユーザー入力を受け取り signup アクションを呼び出す
// - 成否メッセージは slice 側 (authMessage) に委譲し UI は参照のみ
// - ローカルでは入力値と一時的なパスワード一致チェックのみ管理
export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // ローカルメッセージは使用せず、slice管理の authMessage を表示する運用
  const navigate = useNavigate();
  const signup = useChatStore((s) => s.signup);
  // フォーム送信: パスワード一致チェック後に signup を実行
  // 成功/失敗メッセージは slice (authMessage) が設定するためここでは直接設定しない
  const authLoading = useChatStore((s) => s.authLoading);
  const authMessage = useChatStore((s) => s.authMessage);

  // シンプルなクライアントサイド検証 (slice に載せるほどのビジネスロジックではない)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    await signup(email, password);

    navigate(ROUTES.VERIFY, { state: { username: email } });
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
          {!!authMessage && <p className="mt-3 text-sm text-blue-600">{authMessage}</p>}
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
