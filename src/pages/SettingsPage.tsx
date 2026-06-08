import { KeyRound, Save, Shield, UserCog } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { settingsSections } from "../data/app-data";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">Settings</h1>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
            Manage account preferences, notifications, and security layout states.
          </p>
        </div>
        <Button>
          <Save aria-hidden="true" className="h-4 w-4" />
          Save changes
        </Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog aria-hidden="true" className="h-5 w-5 text-teal-600 dark:text-teal-300" />
              Workspace preferences
            </CardTitle>
            <CardDescription>Prepared for settings APIs and persisted user preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settingsSections.map((section) => (
              <div
                key={section.title}
                className="flex flex-col gap-4 rounded-lg border border-ink-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-ink-950 dark:text-white">{section.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">{section.description}</p>
                </div>
                <Switch checked={section.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield aria-hidden="true" className="h-5 w-5 text-coral-600 dark:text-coral-500" />
                Security
              </CardTitle>
              <CardDescription>JWT authentication structure is scaffolded on the backend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" placeholder="Enter current password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" placeholder="Enter new password" type="password" />
              </div>
              <Button className="w-full" variant="secondary">
                <KeyRound aria-hidden="true" className="h-4 w-4" />
                Update password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account status</CardTitle>
              <CardDescription>Frontend-only placeholder for subscription and access state.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="success">Active beta</Badge>
              <Badge variant="outline">MFA pending</Badge>
              <Badge variant="warning">API not connected</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
