export type SkillPriority = {
  skill: string;
  priority: "High" | "Medium" | "Low" | string;
  reason: string;
};

export type SkillGapResponse = {
  id: number;
  targetRole: string;
  company: string | null;
  summary: string;
  missingSkills: SkillPriority[];
  priorityRanking: string[];
  learningRecommendations: string[];
  createdAt: string;
};

export type RoadmapStep = {
  week: number;
  title: string;
  focus: string;
  deliverable: string;
  resources: string[];
};

export type RoadmapResponse = {
  id: number;
  targetRole: string;
  availableWeeks: number;
  hoursPerWeek: number;
  progress: number;
  summary: string;
  roadmap: RoadmapStep[];
  milestones: string[];
  createdAt: string;
};

export type ChatResponse = {
  answer: string;
  suggestedActions: string[];
  createdAt: string;
};

export type ProjectAnalysisResponse = {
  id: number;
  summary: string;
  resumeImprovements: string[];
  scalabilitySuggestions: string[];
  missingTechnologies: string[];
  createdAt: string;
};

export type DashboardMetric = {
  name: string;
  value: number;
};

export type DashboardOverview = {
  resumeScore: number;
  skillProgress: number;
  roadmapProgress: number;
  aiUsageCount: number;
  recommendations: string[];
  readinessTrend: DashboardMetric[];
  skillTrends: DashboardMetric[];
};

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  skills: string;
  education: string;
  targetRole: string;
  targetCompany: string;
};
