import { FormEvent, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Target } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { analyzeSkillGap } from "../../lib/ai-api";
import type { SkillGapResponse } from "../../types/ai";

export function SkillGapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [company, setCompany] = useState("Google");
  const [currentSkills, setCurrentSkills] = useState("Java, Spring Boot, React, TypeScript, MySQL");
  const [result, setResult] = useState<SkillGapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      setResult(await analyzeSkillGap({ targetRole, company, currentSkills }));
    } catch {
      setError("Could not run the skill gap analyzer. Check backend authentication and AI service settings.");
    } finally {
      setIsLoading(false);
    }
  }

  const chartData =
    result?.missingSkills.map((skill, index) => ({
      name: skill.skill,
      priority: skill.priority === "High" ? 90 : skill.priority === "Medium" ? 66 : 42,
      order: index + 1,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="success">AI Skill Gap Analyzer</Badge>
        <h1 className="mt-3 text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">
          Target-role skill intelligence
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
          Compare your current skill set against a target role and company, then prioritize the gaps that matter most.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Analysis input</CardTitle>
            <CardDescription>Use comma-separated skills for the clearest comparison.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target role</Label>
                <Input id="targetRole" onChange={(event) => setTargetRole(event.target.value)} value={targetRole} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Target company</Label>
                <Input id="company" onChange={(event) => setCompany(event.target.value)} value={company} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentSkills">Current skills</Label>
                <textarea
                  className="min-h-32 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  id="currentSkills"
                  onChange={(event) => setCurrentSkills(event.target.value)}
                  value={currentSkills}
                />
              </div>
              {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Target aria-hidden="true" className="h-4 w-4" />}
                Analyze skill gap
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority map</CardTitle>
            <CardDescription>Higher bars indicate gaps to address first.</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-5">
                <p className="rounded-lg bg-ink-50 p-4 text-sm leading-6 text-ink-700 dark:bg-white/[0.045] dark:text-ink-200">
                  {result.summary}
                </p>
                <div className="h-72">
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-white/10" />
                      <XAxis dataKey="name" stroke="currentColor" className="text-ink-400" tickLine={false} />
                      <YAxis stroke="currentColor" className="text-ink-400" tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="priority" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <EmptyState title="No skill gap analysis yet" text="Run the analyzer to generate missing skills, priorities, and learning recommendations." />
            )}
          </CardContent>
        </Card>
      </section>

      {result ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Missing skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.missingSkills.map((skill) => (
                <div className="rounded-lg border border-ink-200 p-4 dark:border-white/10" key={skill.skill}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-ink-950 dark:text-white">{skill.skill}</p>
                    <Badge variant={skill.priority === "High" ? "warning" : "outline"}>{skill.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{skill.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Learning recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.learningRecommendations.map((item) => (
                <p className="rounded-lg bg-ink-50 p-3 text-sm leading-6 text-ink-700 dark:bg-white/[0.045] dark:text-ink-200" key={item}>
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 p-8 text-center dark:border-white/15">
      <p className="font-bold text-ink-950 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-400">{text}</p>
    </div>
  );
}
