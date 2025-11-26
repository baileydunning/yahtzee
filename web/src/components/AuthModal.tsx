import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ApiUser {
  id: string;
  email: string;
  username?: string;
  passwordHash?: string;
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const [loginIdentifier, setLoginIdentifier] = useState(''); // email or username
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const closeAndReset = () => {
    onOpenChange(false);
    setLoginIdentifier('');
    setLoginPassword('');
    setSignupEmail('');
    setSignupUsername('');
    setSignupPassword('');
    setShowReset(false);
    setResetEmail('');
    setResetPassword('');
    setError(null);
    setActiveTab('login');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);
    try {
      await login(loginIdentifier, loginPassword);
      closeAndReset();
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSignupLoading(true);
    try {
      await signup(signupEmail, signupPassword, signupUsername);
      closeAndReset();
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResetLoading(true);
    try {
      const email = resetEmail.trim() || loginIdentifier.trim();
      if (!email || !email.includes('@')) {
        throw new Error('Please enter your email to reset your password');
      }

      const res = await fetch(`/users/?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('Unable to look up user');
      }

      const users = (await res.json()) as ApiUser[];
      if (!Array.isArray(users) || users.length === 0) {
        throw new Error('No account found with that email');
      }

      const user = users[0];
      if (!user.id) {
        throw new Error('Invalid user record');
      }

      if (!resetPassword) {
        throw new Error('Please enter a new password');
      }

      const passwordHash = await hashPassword(resetPassword);
      const updatedUser: ApiUser = {
        ...user,
        passwordHash,
      };

      const updateRes = await fetch(`/users/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to reset password');
      }

      setShowReset(false);
      setResetEmail('');
      setResetPassword('');
      setError(null);
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err?.message || 'Password reset failed. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Rainbow Yahtzee</DialogTitle>
          <DialogDescription>
            Sign in to save your progress and compete on leaderboards
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as 'login' | 'signup');
            setError(null);
            setShowReset(false);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-identifier">Email or Username</Label>
                <Input
                  id="login-identifier"
                  type="text"
                  placeholder="your@email.com or coolname"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div />
                <button
                  type="button"
                  className="text-sm text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    setShowReset((prev) => !prev);
                    setError(null);
                    if (!resetEmail && loginIdentifier.includes('@')) {
                      setResetEmail(loginIdentifier);
                    }
                  }}
                >
                  Forgot your password?
                </button>
              </div>

              {error && activeTab === 'login' && !showReset && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {showReset && (
              <form
                onSubmit={handleReset}
                className="mt-6 space-y-4 rounded-md border p-4"
              >
                <p className="text-sm font-medium">Reset your password</p>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-password">New Password</Label>
                  <Input
                    id="reset-password"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                </div>
                {error && activeTab === 'login' && showReset && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Resetting password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="coolname"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              {error && activeTab === 'signup' && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={signupLoading}
              >
                {signupLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
