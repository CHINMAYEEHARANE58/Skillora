import { api } from "./api";
import type {
  ChatResponse,
  DashboardOverview,
  ProjectAnalysisResponse,
  RoadmapResponse,
  SkillGapResponse,
  UserProfile,
} from "../types/ai";

export async function getDashboardOverview() {
  const response = await api.get<DashboardOverview>("/dashboard/overview");
  return response.data;
}

export async function analyzeSkillGap(payload: {
  targetRole: string;
  company?: string;
  currentSkills?: string;
}) {
  const response = await api.post<SkillGapResponse>("/ai/skill-gap", payload);
  return response.data;
}

export async function generateRoadmap(payload: {
  targetRole: string;
  currentSkills?: string;
  availableWeeks: number;
  hoursPerWeek: number;
}) {
  const response = await api.post<RoadmapResponse>("/ai/roadmap", payload);
  return response.data;
}

export async function askCareerAssistant(message: string) {
  const response = await api.post<ChatResponse>("/ai/chat", { message });
  return response.data;
}

export async function analyzeProject(payload: {
  projectDescription: string;
  targetRole?: string;
}) {
  const response = await api.post<ProjectAnalysisResponse>("/ai/project-analysis", payload);
  return response.data;
}

export async function getUserProfile() {
  const response = await api.get<UserProfile>("/users/profile");
  return response.data;
}

export async function updateUserProfile(payload: Pick<
  UserProfile,
  "fullName" | "skills" | "education" | "targetRole" | "targetCompany"
>) {
  const response = await api.put<UserProfile>("/users/profile", payload);
  return response.data;
}
