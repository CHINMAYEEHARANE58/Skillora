import {
  BarChart3,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Target,
  UserCircle,
} from "lucide-react";

export const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const dashboardStats = [
  {
    label: "Readiness score",
    value: "82%",
    change: "+8 this month",
    icon: BarChart3,
  },
  {
    label: "Applications",
    value: "18",
    change: "5 active loops",
    icon: BriefcaseBusiness,
  },
  {
    label: "Interview reps",
    value: "12",
    change: "3 scheduled",
    icon: MessageSquareText,
  },
  {
    label: "Skill sprints",
    value: "6",
    change: "2 in progress",
    icon: BookOpenCheck,
  },
];

export const readinessData = [
  { month: "Jan", score: 48 },
  { month: "Feb", score: 55 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 68 },
  { month: "May", score: 75 },
  { month: "Jun", score: 82 },
];

export const skillData = [
  { name: "Resume", value: 88 },
  { name: "Portfolio", value: 74 },
  { name: "Interview", value: 68 },
  { name: "Networking", value: 57 },
];

export const roadmapItems = [
  {
    title: "Refresh senior frontend resume",
    description: "Tailor impact bullets for SaaS platform roles.",
    status: "In progress",
    icon: FileText,
  },
  {
    title: "Complete system design practice",
    description: "Run two mock sessions focused on frontend architecture.",
    status: "This week",
    icon: ShieldCheck,
  },
  {
    title: "Apply to target role cluster",
    description: "Prioritize companies with developer tooling teams.",
    status: "Queued",
    icon: Target,
  },
];

export const notifications = [
  { label: "Mock interview feedback ready", time: "8m ago", icon: Bell },
  { label: "Portfolio sprint due tomorrow", time: "2h ago", icon: CalendarCheck },
  { label: "New role match added", time: "Yesterday", icon: BriefcaseBusiness },
];

export const profileSkills = [
  { name: "React", level: 92 },
  { name: "TypeScript", level: 86 },
  { name: "System design", level: 70 },
  { name: "Behavioral interviews", level: 64 },
];

export const settingsSections = [
  {
    title: "Product updates",
    description: "Receive release notes, roadmap updates, and beta invitations.",
    enabled: true,
  },
  {
    title: "Interview reminders",
    description: "Get nudges before scheduled practice sessions and application milestones.",
    enabled: true,
  },
  {
    title: "Profile visibility",
    description: "Allow Skillora to personalize recommendations from your career profile.",
    enabled: false,
  },
];
