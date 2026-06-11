import axios from "axios";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";
  const demoAccounts = [
    {
      label: "Admin demo",
      icon: ShieldCheck,
      email: "admin@skillora.ai",
      password: "Admin@123",
    },
    {
      label: "Student demo",
      icon: UserRound,
      email: "student@skillora.ai",
      password: "Student@123",
    },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (caughtError) {
      setError(getLoginErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoCredentials(account: (typeof demoAccounts)[number]) {
    console.info("[Skillora Auth] Demo credentials selected", { email: account.email });
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your Skillora career workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2 sm:grid-cols-2">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Button
                  className="w-full"
                  key={account.email}
                  onClick={() => fillDemoCredentials(account)}
                  type="button"
                  variant="secondary"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {account.label}
                </Button>
              );
            })}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link className="text-xs font-semibold text-teal-700 dark:text-teal-300" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <Input
              autoComplete="current-password"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>
          {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          New to Skillora?{" "}
          <Link className="font-bold text-teal-700 dark:text-teal-300" to="/register">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function getLoginErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Could not sign in. Please try again.";
  }

  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Backend is not reachable. Start the Spring Boot server on http://localhost:8080, then try again.";
  }

  const message = (error.response.data as { message?: string } | undefined)?.message;

  if (message) {
    return message;
  }

  if (error.response.status === 401) {
    return "Invalid email or password.";
  }

  return "Could not sign in. Please try again.";
}
