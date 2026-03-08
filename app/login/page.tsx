import LoginForm from "../../components/login/login-form";
// import { checkIsAuthenticated } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Alabama Cyber Range",
  description: "Sign in to the Alabama Cyber Range platform",
};

const SignIn = async () => {
  // Middleware already handles redirecting authenticated users away from signin page

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" /> */}
        {/* <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" /> */}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-16">
          <LoginForm />
        </main>
      </div>
    </div>
  );
};

export default SignIn;
