import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import {
  dashboardStats,
  notifications,
  readinessData,
  roadmapItems,
  skillData,
} from "../data/app-data";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="success">Career readiness active</Badge>
          <h1 className="mt-3 text-3xl font-black text-ink-950 dark:text-white sm:text-4xl">
            Good morning, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-300">
            Your Skillora workspace is set up for resume focus, interview prep, and target-role tracking.
          </p>
        </div>
        <Button>
          New career sprint
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-400/12 dark:text-teal-200">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <Badge variant="outline">{stat.change}</Badge>
                </div>
                <p className="mt-5 text-sm font-medium text-ink-500 dark:text-ink-400">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-ink-950 dark:text-white">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader>
            <CardTitle>Readiness trend</CardTitle>
            <CardDescription>Monthly progress across profile strength, skill gaps, and practice loops.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart data={readinessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-white/10" />
                  <XAxis dataKey="month" stroke="currentColor" className="text-ink-400" tickLine={false} />
                  <YAxis stroke="currentColor" className="text-ink-400" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid rgba(148, 163, 184, 0.28)",
                    }}
                  />
                  <Area dataKey="score" fill="#14b8a6" fillOpacity={0.18} stroke="#14b8a6" strokeWidth={3} type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill focus</CardTitle>
            <CardDescription>Current strength by preparation area.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={skillData} layout="vertical">
                  <CartesianGrid horizontal={false} stroke="currentColor" className="text-ink-100 dark:text-white/10" />
                  <XAxis hide type="number" />
                  <YAxis dataKey="name" stroke="currentColor" className="text-ink-400" tickLine={false} type="category" width={86} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid rgba(148, 163, 184, 0.28)",
                    }}
                  />
                  <Bar dataKey="value" fill="#f97360" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Career roadmap</CardTitle>
            <CardDescription>Layout-only milestones prepared for future AI recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmapItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 rounded-lg border border-ink-200 p-4 dark:border-white/10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-bold text-ink-950 dark:text-white">{item.title}</h3>
                      <Badge variant="warning">{item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent signals</CardTitle>
            <CardDescription>Notification layout for job search and coaching events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg bg-ink-50 p-3 dark:bg-white/[0.045]">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-700 dark:bg-white/10 dark:text-white">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-950 dark:text-white">{item.label}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{item.time}</p>
                  </div>
                </div>
              );
            })}
            <div className="rounded-lg border border-ink-200 p-4 dark:border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-700 dark:text-ink-200">Profile completion</span>
                <span className="font-bold text-ink-950 dark:text-white">78%</span>
              </div>
              <Progress className="mt-3" value={78} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
