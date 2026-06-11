import { api } from "./api";
import type { ResumeAnalysis } from "../types/resume";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ResumeAnalysis>("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function getResumeAnalyses() {
  const response = await api.get<ResumeAnalysis[]>("/resumes");
  return response.data;
}

export async function getResumeAnalysis(id: number) {
  const response = await api.get<ResumeAnalysis>(`/resumes/${id}`);
  return response.data;
}
