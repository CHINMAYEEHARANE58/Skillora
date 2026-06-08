import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function LoginPage() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your Skillora career workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <a className="text-xs font-semibold text-teal-700 dark:text-teal-300" href="#">
                Forgot password?
              </a>
            </div>
            <Input id="password" placeholder="Enter your password" type="password" />
          </div>
          <Button className="w-full" type="button">
            Sign in
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button className="w-full" type="button" variant="secondary">
            <Github aria-hidden="true" className="h-4 w-4" />
            Continue with GitHub
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
