export type ResumeAnalysisStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export type ResumeAnalysis = {
  id: number;
  fileName: string;
  status: ResumeAnalysisStatus;
  atsScore: number | null;
  missingKeywords: string[];
  missingTechnicalSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  failureReason: string | null;
  createdAt: string;
  completedAt: string | null;
};
