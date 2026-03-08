"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import {
//   signIn,
//   signInWithRedirect,
// } from 'aws-amplify/auth';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { paths } from '@/lib/paths';

import NewPasswordForm from "@/components/login/new-password-login-form";
import AnimatedLogo from "@/components/animated-logo";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  type Stage = "SIGN_IN" | "NEW_PASSWORD";
  const [stage, setStage] = useState<Stage>("SIGN_IN");

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // const { nextStep } = await signIn({
      //   username: formData.email,
      //   password: formData.password,
      // });
      // switch (nextStep.signInStep) {
      //   case 'DONE':
      //     router.push(paths.home);
      //     break;
      //   case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
      //     setStage('NEW_PASSWORD');
      //     break;
      //   case 'RESET_PASSWORD':
      //     router.push(paths.forgotPassword);
      //     break;
      //   default:
      //     console.warn('Unhandled step:', nextStep.signInStep);
      // }
    } catch (err: any) {
      setError(err.message ?? "Sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     await signInWithRedirect({
  //       provider: 'Google',
  //     });
  //   } catch {
  //     setError('An error occurred during Google sign-in. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <Card className="w-full max-w-md mx-auto">
      {stage === "SIGN_IN" && (
        <>
          <CardHeader className="space-y-1">
            <div className="flex justify-center items-center w-full">
              <AnimatedLogo size={300} autoPlay />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Sign in
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground rounded-xs">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              // onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              {/* — Google SVG icon here — */}
              Sign in with Google
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              <Link
                // href={paths.forgotPassword}
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </>
      )}

      {stage === "NEW_PASSWORD" && (
        // <NewPasswordForm onSuccess={() => router.push(paths.home)} />
        <NewPasswordForm onSuccess={() => router.push("/")} />
      )}
    </Card>
  );
}
