import { FormEvent, useState } from "react";
import { Code2, Loader2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { analyzeProject } from "../../lib/ai-api";
import type { ProjectAnalysisResponse } from "../../types/ai";

const starterProject =
  "Built a career dashboard with React, Spring Boot, JWT auth, MySQL, resume uploads, AI analysis, and analytics charts for students.";

export function ProjectAnalyzerPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [projectDescription, setProjectDescription] = useState(starterProject);
  const [result, setResult] = useState<ProjectAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      setResult(await analyzeProject({ targetRole, projectDescription }));
    } catch {
      setError("Could not analyze the project. Check backend and AI service settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="success">AI Project Analyzer</Badge>
        <h1 className="mt-3 text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">
          Project resume signal
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
          Turn a project description into stronger resume bullets, scalability ideas, and missing technology signals.
        </p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Project context</CardTitle>
            <CardDescription>Describe what you built, your role, stack, and outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="projectRole">Target role</Label>
                <Input id="projectRole" onChange={(event) => setTargetRole(event.target.value)} value={targetRole} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project description</Label>
                <textarea
                  className="min-h-52 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-white/10 dark:bg-white/10 dark:text-white"
                  id="projectDescription"
                  onChange={(event) => setProjectDescription(event.target.value)}
                  value={projectDescription}
                />
              </div>
              {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Code2 aria-hidden="true" className="h-4 w-4" />}
                Analyze project
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis summary</CardTitle>
            <CardDescription>Use this to rewrite project bullets and choose the next build iteration.</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <p className="rounded-lg bg-ink-50 p-4 text-sm leading-6 text-ink-700 dark:bg-white/[0.045] dark:text-ink-200">{result.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingTechnologies.map((technology) => (
                    <Badge key={technology} variant="warning">{technology}</Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-ink-300 p-8 text-center dark:border-white/15">
                <p className="font-bold text-ink-950 dark:text-white">No project analysis yet</p>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Submit a project to get resume and scalability feedback.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {result ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <InsightList title="Resume improvements" items={result.resumeImprovements} />
          <InsightList title="Scalability suggestions" items={result.scalabilitySuggestions} />
        </section>
      ) : null}
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <p className="rounded-lg bg-ink-50 p-3 text-sm leading-6 text-ink-700 dark:bg-white/[0.045] dark:text-ink-200" key={item}>
            {item}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
