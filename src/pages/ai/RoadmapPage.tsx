import { FormEvent, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import { generateRoadmap } from "../../lib/ai-api";
import type { RoadmapResponse } from "../../types/ai";

export function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("AI Full Stack Engineer");
  const [currentSkills, setCurrentSkills] = useState("Java, React, TypeScript, MySQL");
  const [availableWeeks, setAvailableWeeks] = useState(12);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [result, setResult] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      setResult(await generateRoadmap({ targetRole, currentSkills, availableWeeks, hoursPerWeek }));
    } catch {
      setError("Could not generate roadmap. Check backend and AI service settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="success">AI Career Roadmap</Badge>
        <h1 className="mt-3 text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">
          Personalized learning plan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
          Generate a weekly preparation plan from your current skills, target role, and available time.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Plan inputs</CardTitle>
            <CardDescription>Keep time estimates realistic so the roadmap stays usable.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="roadmapRole">Target role</Label>
                <Input id="roadmapRole" onChange={(event) => setTargetRole(event.target.value)} value={targetRole} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weeks">Available weeks</Label>
                  <Input id="weeks" min={2} max={52} onChange={(event) => setAvailableWeeks(Number(event.target.value))} type="number" value={availableWeeks} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours per week</Label>
                  <Input id="hours" min={2} max={60} onChange={(event) => setHoursPerWeek(Number(event.target.value))} type="number" value={hoursPerWeek} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roadmapSkills">Current skills</Label>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  id="roadmapSkills"
                  onChange={(event) => setCurrentSkills(event.target.value)}
                  value={currentSkills}
                />
              </div>
              {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CalendarDays aria-hidden="true" className="h-4 w-4" />}
                Generate roadmap
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roadmap summary</CardTitle>
            <CardDescription>Progress starts at planning state and grows as milestones are completed.</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-5">
                <div className="rounded-lg bg-ink-50 p-4 dark:bg-white/[0.045]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink-700 dark:text-ink-200">Roadmap progress</span>
                    <span className="font-bold text-ink-950 dark:text-white">{result.progress}%</span>
                  </div>
                  <Progress className="mt-3" value={result.progress} />
                </div>
                <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{result.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {result.milestones.map((milestone) => (
                    <Badge key={milestone} variant="outline">{milestone}</Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-ink-300 p-8 text-center dark:border-white/15">
                <p className="font-bold text-ink-950 dark:text-white">No roadmap yet</p>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Generate a plan to see weekly milestones.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {result ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {result.roadmap.map((step) => (
            <Card key={`${step.week}-${step.title}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{step.title}</CardTitle>
                  <Badge variant="warning">Week {step.week}</Badge>
                </div>
                <CardDescription>{step.focus}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-ink-950 dark:text-white">{step.deliverable}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.resources.map((resource) => (
                    <Badge key={resource} variant="outline">{resource}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}
    </div>
  );
}
