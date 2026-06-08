import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const token = await forgotPassword(email);
      setResetToken(token);
      setMessage("If the account exists, a password reset token has been generated.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>Request a reset token for your Skillora account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          {message ? <p className="rounded-lg bg-teal-500/10 px-3 py-2 text-sm font-semibold text-teal-700 dark:text-teal-200">{message}</p> : null}
          {resetToken ? (
            <div className="rounded-lg border border-ink-200 p-3 text-sm dark:border-white/10">
              <p className="font-semibold text-ink-950 dark:text-white">Development reset token</p>
              <p className="mt-2 break-all text-ink-600 dark:text-ink-300">{resetToken}</p>
            </div>
          ) : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending..." : "Send reset token"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Already have a token?{" "}
          <Link className="font-bold text-teal-700 dark:text-teal-300" to="/reset-password">
            Reset password
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
