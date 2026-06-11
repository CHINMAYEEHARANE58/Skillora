import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Clock3, FileUp, Loader2, TriangleAlert, XCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { getResumeAnalyses, getResumeAnalysis, uploadResume } from "../lib/resume-api";
import type { ResumeAnalysis } from "../types/resume";

const statusConfig = {
  QUEUED: { icon: Clock3, label: "Queued", badge: "warning" },
  PROCESSING: { icon: Loader2, label: "Processing", badge: "warning" },
  COMPLETED: { icon: CheckCircle2, label: "Completed", badge: "success" },
  FAILED: { icon: XCircle, label: "Failed", badge: "default" },
} as const;

export function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAnalyses();
  }, []);

  useEffect(() => {
    if (!selectedAnalysis || !["QUEUED", "PROCESSING"].includes(selectedAnalysis.status)) {
      return;
    }

    const interval = window.setInterval(async () => {
      const updated = await getResumeAnalysis(selectedAnalysis.id);
      setSelectedAnalysis(updated);
      setAnalyses((current) =>
        current.map((analysis) => (analysis.id === updated.id ? updated : analysis))
      );
    }, 3000);

    return () => window.clearInterval(interval);
  }, [selectedAnalysis]);

  async function loadAnalyses() {
    try {
      const data = await getResumeAnalyses();
      setAnalyses(data);
      setSelectedAnalysis(data[0] ?? null);
    } catch {
      setError("Connect the backend to load previous resume analyses.");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError("");
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Choose a PDF resume first.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const analysis = await uploadResume(file);
      setSelectedAnalysis(analysis);
      setAnalyses((current) => [analysis, ...current]);
      setFile(null);
    } catch {
      setError("Upload failed. Check backend, S3, Kafka, and authentication settings.");
    } finally {
      setIsUploading(false);
    }
  }

  const score = selectedAnalysis?.atsScore ?? 0;
  const scoreData = useMemo(
    () => [{ name: "ATS Score", value: score, fill: score >= 75 ? "#14b8a6" : "#f97360" }],
    [score]
  );
  const scoreBreakdown = useMemo(
    () => [
      { name: "ATS", value: selectedAnalysis?.atsScore ?? 0 },
      { name: "Keywords", value: Math.max(0, 100 - (selectedAnalysis?.missingKeywords.length ?? 8) * 9) },
      { name: "Strengths", value: Math.min(100, (selectedAnalysis?.strengths.length ?? 0) * 24) },
      { name: "Clarity", value: Math.min(100, (selectedAnalysis?.suggestedImprovements.length ?? 0) * 18) },
    ],
    [selectedAnalysis]
  );

  const StatusIcon = selectedAnalysis ? statusConfig[selectedAnalysis.status].icon : TriangleAlert;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="success">AI Resume Analyzer</Badge>
          <h1 className="mt-3 text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">
            Resume intelligence
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
            Upload a PDF resume, process it asynchronously, and review ATS score, keyword gaps,
            strengths, weaknesses, and improvements.
          </p>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF resume</CardTitle>
            <CardDescription>Files are stored in S3 and processed through Kafka.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleUpload}>
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-ink-300 bg-ink-50 px-5 text-center transition-colors hover:border-teal-500 dark:border-white/15 dark:bg-white/[0.045]">
                <FileUp aria-hidden="true" className="h-10 w-10 text-teal-600 dark:text-teal-300" />
                <span className="mt-4 text-sm font-bold text-ink-950 dark:text-white">
                  {file ? file.name : "Select a PDF resume"}
                </span>
                <span className="mt-2 text-xs leading-5 text-ink-500 dark:text-ink-400">
                  PDF only, up to 10MB.
                </span>
                <input accept="application/pdf" className="sr-only" onChange={handleFileChange} type="file" />
              </label>
              {error ? <p className="rounded-lg bg-coral-500/10 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
              <Button className="w-full" disabled={isUploading} type="submit">
                {isUploading ? (
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                ) : (
                  <FileUp aria-hidden="true" className="h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Analyze resume"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis status</CardTitle>
            <CardDescription>
              Latest processing state from MySQL, updated as the Kafka worker completes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAnalysis ? (
              <div className="grid gap-5 md:grid-cols-[0.6fr_1fr]">
                <div className="flex flex-col items-center justify-center rounded-lg bg-ink-50 p-5 dark:bg-white/[0.045]">
                  <div className="h-48 w-full">
                    <ResponsiveContainer height="100%" width="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        data={scoreData}
                        endAngle={-270}
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={90}
                      >
                        <RadialBar background dataKey="value" cornerRadius={8} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-4xl font-black text-ink-950 dark:text-white">{score}</p>
                  <p className="mt-1 text-sm font-semibold text-ink-500 dark:text-ink-400">ATS score</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-ink-200 p-4 dark:border-white/10">
                    <StatusIcon
                      aria-hidden="true"
                      className={selectedAnalysis.status === "PROCESSING" ? "h-5 w-5 animate-spin" : "h-5 w-5"}
                    />
                    <div>
                      <p className="font-bold text-ink-950 dark:text-white">{selectedAnalysis.fileName}</p>
                      <Badge
                        className="mt-2"
                        variant={statusConfig[selectedAnalysis.status].badge}
                      >
                        {statusConfig[selectedAnalysis.status].label}
                      </Badge>
                    </div>
                  </div>
                  <Metric label="Missing keywords" value={selectedAnalysis.missingKeywords.length} />
                  <Metric label="Strengths found" value={selectedAnalysis.strengths.length} />
                  <Metric label="Improvements" value={selectedAnalysis.suggestedImprovements.length} />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-ink-300 p-8 text-center dark:border-white/15">
                <p className="font-bold text-ink-950 dark:text-white">No resume analysis yet</p>
                <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                  Upload a PDF to start the async analysis pipeline.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {selectedAnalysis ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Score breakdown</CardTitle>
              <CardDescription>Dashboard-ready visualization of resume quality signals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={scoreBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-white/10" />
                    <XAxis dataKey="name" stroke="currentColor" className="text-ink-400" tickLine={false} />
                    <YAxis stroke="currentColor" className="text-ink-400" tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {scoreBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.value >= 75 ? "#14b8a6" : "#f97360"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyword gaps</CardTitle>
              <CardDescription>Missing terms from the analyzer response.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedAnalysis.missingKeywords.length ? (
                  selectedAnalysis.missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="warning">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="success">No major keyword gaps</Badge>
                )}
              </div>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-700 dark:text-ink-200">Keyword coverage</span>
                  <span className="font-bold text-ink-950 dark:text-white">
                    {scoreBreakdown[1].value}%
                  </span>
                </div>
                <Progress value={scoreBreakdown[1].value} />
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {selectedAnalysis ? (
        <section className="grid gap-6 lg:grid-cols-3">
          <InsightCard title="Strengths" items={selectedAnalysis.strengths} variant="success" />
          <InsightCard title="Weaknesses" items={selectedAnalysis.weaknesses} variant="warning" />
          <InsightCard title="Suggested improvements" items={selectedAnalysis.suggestedImprovements} variant="default" />
        </section>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Recent analyses</CardTitle>
          <CardDescription>Stored in MySQL and mirrored to Snowflake when enabled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analyses.length ? (
            analyses.map((analysis) => (
              <button
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-ink-200 p-4 text-left transition-colors hover:border-teal-500 dark:border-white/10"
                key={analysis.id}
                onClick={() => setSelectedAnalysis(analysis)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink-950 dark:text-white">{analysis.fileName}</p>
                  <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant={statusConfig[analysis.status].badge}>
                  {analysis.status}
                </Badge>
              </button>
            ))
          ) : (
            <p className="text-sm text-ink-500 dark:text-ink-400">No uploaded resumes yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-ink-50 p-4 dark:bg-white/[0.045]">
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink-950 dark:text-white">{value}</p>
    </div>
  );
}

function InsightCard({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "default" | "success" | "warning";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="rounded-lg bg-ink-50 p-3 text-sm leading-6 text-ink-700 dark:bg-white/[0.045] dark:text-ink-200">
              <Badge className="mb-2" variant={variant}>
                Signal
              </Badge>
              <p>{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink-500 dark:text-ink-400">Waiting for analysis output.</p>
        )}
      </CardContent>
    </Card>
  );
}
