import { Mail, MapPin, Pencil, Phone, ShieldCheck } from "lucide-react";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { profileSkills } from "../data/app-data";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">Profile</h1>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
            Keep your career identity current for future AI personalization.
          </p>
        </div>
        <Button>
          <Pencil aria-hidden="true" className="h-4 w-4" />
          Edit profile
        </Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 text-lg" name="Chinmayee Harane" />
              <div>
                <h2 className="text-xl font-black text-ink-950 dark:text-white">Chinmayee Harane</h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Frontend Engineer</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-ink-600 dark:text-ink-300">
              <p className="flex items-center gap-3">
                <Mail aria-hidden="true" className="h-4 w-4" />
                chinmayee@example.com
              </p>
              <p className="flex items-center gap-3">
                <Phone aria-hidden="true" className="h-4 w-4" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                Pune, India
              </p>
            </div>
            <div className="mt-6 rounded-lg bg-ink-50 p-4 dark:bg-white/[0.045]">
              <div className="flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                <p className="font-bold text-ink-950 dark:text-white">Career profile verified</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                Ready for resume, roadmap, and interview features when backend logic is connected.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>Layout fields prepared for profile update APIs.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" defaultValue="Chinmayee Harane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Current role</Label>
                <Input id="role" defaultValue="Frontend Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="chinmayee@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Pune, India" />
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Career skill profile</CardTitle>
          <CardDescription>Static layout for future AI skill analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {profileSkills.map((skill) => (
            <div key={skill.name} className="rounded-lg border border-ink-200 p-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-ink-950 dark:text-white">{skill.name}</p>
                <Badge variant="outline">{skill.level}%</Badge>
              </div>
              <Progress className="mt-3" value={skill.level} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
