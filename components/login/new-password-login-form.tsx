'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { confirmSignIn } from 'aws-amplify/auth';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  onSuccess?: () => void;
}

export default function NewPasswordForm({ onSuccess }: Props) {
  const router = useRouter();
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pwd !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // await confirmSignIn({ challengeResponse: pwd });
      onSuccess ? onSuccess() : router.push('/');
    } catch (err: any) {
      setError(err.message ?? 'Unable to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 max-w-md mx-auto w-full"
    >
      <div className="space-y-2">
        <Label htmlFor="newPwd">Choose a new password</Label>
        <div className="relative">
          <Input
            id="newPwd"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPwd">Confirm new password</Label>
        <div className="relative">
          <Input
            id="confirmPwd"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !pwd || !confirmPwd}
      >
        {isLoading ? 'Updating…' : 'Change password'}
      </Button>
    </form>
  );
}
