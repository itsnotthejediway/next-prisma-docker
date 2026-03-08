'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
// import { paths } from '@/lib/paths';

type Stage = 'EMAIL' | 'CODE';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('EMAIL');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startReset = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const { nextStep } = await resetPassword({ username: email });

      // switch (nextStep.resetPasswordStep) {
      //   case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
      //     setStage('CODE');
      //     break;
      //   case 'DONE':
      //     router.push(paths.signin);
      //     break;
      //   default:
      //     console.warn('Unhandled reset step:', nextStep.resetPasswordStep);
      // }
    } catch (err: any) {
      setError(err.message ?? 'Unable to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const submitNewPassword = async () => {
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // await confirmResetPassword({
      //   username: email,
      //   confirmationCode: code,
      //   newPassword: newPwd,
      // });
      // router.push(`${paths.signin}?reset=success`);
    } catch (err: any) {
      setError(err.message ?? 'Unable to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot password
        </CardTitle>
        <CardDescription className="text-center">
          {stage === 'EMAIL'
            ? 'Enter the email associated with your account'
            : 'Enter the verification code and choose a new password'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {stage === 'EMAIL' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              disabled={isLoading || !email}
              className="w-full"
              onClick={startReset}
            >
              {isLoading ? 'Sending…' : 'Send Code'}
            </Button>
          </>
        )}

        {stage === 'CODE' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPwd">New password</Label>
              <div className="relative">
                <Input
                  id="newPwd"
                  type={showPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPwd">Confirm new password</Label>
              <Input
                id="confirmPwd"
                type={showPwd ? 'text' : 'password'}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              disabled={isLoading || !code || !newPwd || !confirmPwd}
              onClick={submitNewPassword}
              className="w-full"
            >
              {isLoading ? 'Resetting…' : 'Reset Password'}
            </Button>

            <Button
              variant="outline"
              onClick={() => startReset()}
              className="w-full"
            >
              Resend Code
            </Button>
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Link
          // href={paths.signin}
          href="#"
          className="text-sm underline underline-offset-4 hover:text-primary"
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
