import axios from "axios";
import { ArrowRight, CheckCircle2, Info, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordRules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const isPasswordValid = passwordRules.every((rule) => rule.valid);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements before creating your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ fullName, email, password });
      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      setError(getRegisterErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Create your workspace</CardTitle>
        <CardDescription>Start with a profile, then connect real career workflows later.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              autoComplete="name"
              id="name"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Chinmayee Harane"
              required
              value={fullName}
            />
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
            <Label htmlFor="password">Password</Label>
            <Input
              autoComplete="new-password"
              id="password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
              required
              type="password"
              value={password}
            />
            <div className="rounded-lg border border-ink-200 bg-ink-50 p-3 text-sm dark:border-white/10 dark:bg-white/[0.045]">
              <div className="flex items-center gap-2 font-semibold text-ink-800 dark:text-ink-100">
                <Info aria-hidden="true" className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                Password requirements
              </div>
              <ul className="mt-3 grid gap-2">
                {passwordRules.map((rule) => {
                  const Icon = rule.valid ? CheckCircle2 : XCircle;
                  return (
                    <li
                      className={
                        rule.valid
                          ? "flex items-center gap-2 text-teal-700 dark:text-teal-200"
                          : "flex items-center gap-2 text-ink-500 dark:text-ink-400"
                      }
                      key={rule.label}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting || !isPasswordValid} type="submit">
            {isSubmitting ? "Creating account..." : "Create account"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Already have an account?{" "}
          <Link className="font-bold text-teal-700 dark:text-teal-300" to="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function getRegisterErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Could not create account. Please try again.";
  }

  if (error.code === "ERR_NETWORK" || !error.response) {
    return "Backend is not reachable. Start the Spring Boot server on http://localhost:8080, then try again.";
  }

  const message = (error.response.data as { message?: string } | undefined)?.message;

  if (message) {
    if (message.includes("Email is already registered")) {
      return "This email already has an account. Please sign in instead.";
    }

    return message;
  }

  if (error.response.status === 409 || error.response.status === 400) {
    return "Could not create account. Use a different email and check the password rules.";
  }

  return "Could not create account. Please try again.";
}
