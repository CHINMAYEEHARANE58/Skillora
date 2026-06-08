import { ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await resetPassword(token, newPassword);
      navigate("/login", { replace: true });
    } catch {
      setError("Could not reset password. Check the token and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Set a new password</CardTitle>
        <CardDescription>Use your reset token to secure the account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="token">Reset token</Label>
            <Input id="token" onChange={(event) => setToken(event.target.value)} required value={token} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              autoComplete="new-password"
              id="password"
              minLength={8}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              type="password"
              value={newPassword}
            />
          </div>
          {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Resetting..." : "Reset password"}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Remembered it?{" "}
          <Link className="font-bold text-teal-700 dark:text-teal-300" to="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
