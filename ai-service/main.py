from __future__ import annotations

import json
import os
import re
from collections import Counter
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Skillora AI Career Service", version="1.0.0")


class ResumeAnalysisRequest(BaseModel):
    resumeText: str = Field(min_length=20)


class ResumeAnalysisResponse(BaseModel):
    atsScore: int
    missingKeywords: list[str]
    missingTechnicalSkills: list[str]
    strengths: list[str]
    weaknesses: list[str]
    suggestedImprovements: list[str]


class SkillGapRequest(BaseModel):
    targetRole: str
    company: str | None = None
    currentSkills: str = ""
    education: str | None = None


class SkillPriority(BaseModel):
    skill: str
    priority: str
    reason: str


class SkillGapResponse(BaseModel):
    id: int | None = None
    targetRole: str
    company: str | None = None
    summary: str
    missingSkills: list[SkillPriority]
    priorityRanking: list[str]
    learningRecommendations: list[str]
    createdAt: datetime


class RoadmapRequest(BaseModel):
    targetRole: str
    currentSkills: str = ""
    availableWeeks: int = 12
    hoursPerWeek: int = 8


class RoadmapStep(BaseModel):
    week: int
    title: str
    focus: str
    deliverable: str
    resources: list[str]


class RoadmapResponse(BaseModel):
    id: int | None = None
    targetRole: str
    availableWeeks: int
    hoursPerWeek: int
    progress: int = 15
    summary: str
    roadmap: list[RoadmapStep]
    milestones: list[str]
    createdAt: datetime


class ChatRequest(BaseModel):
    message: str
    profile: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    answer: str
    suggestedActions: list[str]
    createdAt: datetime


class ProjectAnalysisRequest(BaseModel):
    projectDescription: str
    targetRole: str | None = None
    currentSkills: str = ""


class ProjectAnalysisResponse(BaseModel):
    id: int | None = None
    summary: str
    resumeImprovements: list[str]
    scalabilitySuggestions: list[str]
    missingTechnologies: list[str]
    createdAt: datetime


TARGET_KEYWORDS = {
    "impact",
    "leadership",
    "metrics",
    "collaboration",
    "ownership",
    "internship",
    "projects",
    "testing",
    "deployment",
    "scalability",
}

TECHNICAL_SKILLS = {
    "java",
    "spring boot",
    "react",
    "typescript",
    "python",
    "sql",
    "mysql",
    "aws",
    "docker",
    "kafka",
    "redis",
    "snowflake",
    "fastapi",
    "langchain",
    "ci/cd",
}

ROLE_SKILLS = {
    "frontend": ["React", "TypeScript", "Testing Library", "Accessibility", "Performance optimization"],
    "backend": ["Spring Boot", "REST API design", "SQL indexing", "Docker", "Observability"],
    "full stack": ["React", "Spring Boot", "JWT security", "MySQL", "Cloud deployment"],
    "data": ["Python", "SQL", "Snowflake", "Data modeling", "Dashboarding"],
    "ai": ["Python", "LangChain", "Vector databases", "Prompt evaluation", "Model APIs"],
}


@app.get("/health")
def health() -> dict[str, str]:
    provider = "gemini" if os.getenv("GEMINI_API_KEY") else "openai" if os.getenv("OPENAI_API_KEY") else "fallback"
    return {"status": "ok", "provider": provider}


@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(payload: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    fallback = heuristic_resume_analysis(payload.resumeText)
    prompt = f"""
You are Skillora, an AI career copilot for students. Analyze this resume for ATS quality.
Return strict JSON with keys: atsScore, missingKeywords, missingTechnicalSkills, strengths, weaknesses, suggestedImprovements.
Resume:
{payload.resumeText[:12000]}
"""
    ai_json = call_llm_json(prompt)
    if not ai_json:
        return fallback
    return ResumeAnalysisResponse(
        atsScore=clamp_int(ai_json.get("atsScore"), fallback.atsScore),
        missingKeywords=string_list(ai_json.get("missingKeywords"), fallback.missingKeywords),
        missingTechnicalSkills=string_list(ai_json.get("missingTechnicalSkills"), fallback.missingTechnicalSkills),
        strengths=string_list(ai_json.get("strengths"), fallback.strengths),
        weaknesses=string_list(ai_json.get("weaknesses"), fallback.weaknesses),
        suggestedImprovements=string_list(ai_json.get("suggestedImprovements"), fallback.suggestedImprovements),
    )


@app.post("/skill-gap", response_model=SkillGapResponse)
def analyze_skill_gap(payload: SkillGapRequest) -> SkillGapResponse:
    fallback = fallback_skill_gap(payload)
    prompt = f"""
Analyze the student's skill gap for target role "{payload.targetRole}" at "{payload.company or 'target companies'}".
Current skills: {payload.currentSkills}
Education: {payload.education or 'not provided'}
Return strict JSON with keys: summary, missingSkills(array of objects skill,priority,reason), priorityRanking, learningRecommendations.
"""
    ai_json = call_llm_json(prompt)
    if not ai_json:
        return fallback
    return SkillGapResponse(
        targetRole=payload.targetRole,
        company=payload.company,
        summary=str(ai_json.get("summary") or fallback.summary),
        missingSkills=parse_skill_priorities(ai_json.get("missingSkills"), fallback.missingSkills),
        priorityRanking=string_list(ai_json.get("priorityRanking"), fallback.priorityRanking),
        learningRecommendations=string_list(ai_json.get("learningRecommendations"), fallback.learningRecommendations),
        createdAt=now(),
    )


@app.post("/career-roadmap", response_model=RoadmapResponse)
def generate_roadmap(payload: RoadmapRequest) -> RoadmapResponse:
    fallback = fallback_roadmap(payload)
    prompt = f"""
Create a personalized learning roadmap for a student targeting "{payload.targetRole}".
Current skills: {payload.currentSkills}
Available preparation time: {payload.availableWeeks} weeks, {payload.hoursPerWeek} hours per week.
Return strict JSON with keys: summary, roadmap(array objects week,title,focus,deliverable,resources), milestones.
"""
    ai_json = call_llm_json(prompt)
    if not ai_json:
        return fallback
    return RoadmapResponse(
        targetRole=payload.targetRole,
        availableWeeks=payload.availableWeeks,
        hoursPerWeek=payload.hoursPerWeek,
        progress=15,
        summary=str(ai_json.get("summary") or fallback.summary),
        roadmap=parse_roadmap_steps(ai_json.get("roadmap"), fallback.roadmap),
        milestones=string_list(ai_json.get("milestones"), fallback.milestones),
        createdAt=now(),
    )


@app.post("/career-chat", response_model=ChatResponse)
def career_chat(payload: ChatRequest) -> ChatResponse:
    fallback = fallback_chat(payload)
    prompt = f"""
You are Skillora, a concise career assistant for students. Answer the user's career question using their profile.
Profile: {json.dumps(payload.profile)}
Question: {payload.message}
Return strict JSON with keys: answer, suggestedActions.
"""
    ai_json = call_llm_json(prompt)
    if not ai_json:
        return fallback
    return ChatResponse(
        answer=str(ai_json.get("answer") or fallback.answer),
        suggestedActions=string_list(ai_json.get("suggestedActions"), fallback.suggestedActions),
        createdAt=now(),
    )


@app.post("/project-analysis", response_model=ProjectAnalysisResponse)
def analyze_project(payload: ProjectAnalysisRequest) -> ProjectAnalysisResponse:
    fallback = fallback_project(payload)
    prompt = f"""
Analyze this student project for career readiness toward "{payload.targetRole or 'their target role'}".
Current skills: {payload.currentSkills}
Project: {payload.projectDescription}
Return strict JSON with keys: summary, resumeImprovements, scalabilitySuggestions, missingTechnologies.
"""
    ai_json = call_llm_json(prompt)
    if not ai_json:
        return fallback
    return ProjectAnalysisResponse(
        summary=str(ai_json.get("summary") or fallback.summary),
        resumeImprovements=string_list(ai_json.get("resumeImprovements"), fallback.resumeImprovements),
        scalabilitySuggestions=string_list(ai_json.get("scalabilitySuggestions"), fallback.scalabilitySuggestions),
        missingTechnologies=string_list(ai_json.get("missingTechnologies"), fallback.missingTechnologies),
        createdAt=now(),
    )


def heuristic_resume_analysis(text: str) -> ResumeAnalysisResponse:
    normalized = text.lower()
    words = re.findall(r"[a-zA-Z][a-zA-Z+#./-]+", normalized)
    word_count = len(words)
    keyword_hits = {keyword for keyword in TARGET_KEYWORDS if keyword in normalized}
    skill_hits = {skill for skill in TECHNICAL_SKILLS if skill in normalized}
    missing_keywords = sorted(TARGET_KEYWORDS - keyword_hits)[:8]
    missing_technical_skills = [skill.title() for skill in sorted(TECHNICAL_SKILLS - skill_hits)[:8]]
    number_count = len(re.findall(r"\b\d+%?|\$\d+", text))
    action_verbs = count_action_verbs(words)

    score = 45
    score += min(len(keyword_hits) * 3, 24)
    score += min(len(skill_hits) * 3, 24)
    score += min(number_count * 3, 15)
    score += 8 if word_count >= 350 else 0
    score += 4 if action_verbs >= 8 else 0
    score = max(0, min(score, 98))

    return ResumeAnalysisResponse(
        atsScore=score,
        missingKeywords=missing_keywords,
        missingTechnicalSkills=missing_technical_skills,
        strengths=build_strengths(keyword_hits, skill_hits, number_count, action_verbs, word_count),
        weaknesses=build_weaknesses(missing_keywords, missing_technical_skills, number_count, word_count),
        suggestedImprovements=build_improvements(missing_keywords, missing_technical_skills, number_count, word_count),
    )


def fallback_skill_gap(payload: SkillGapRequest) -> SkillGapResponse:
    current = {item.strip().lower() for item in payload.currentSkills.split(",") if item.strip()}
    role_key = role_bucket(payload.targetRole)
    required = ROLE_SKILLS.get(role_key, ROLE_SKILLS["full stack"])
    missing = [
        SkillPriority(skill=skill, priority="High" if index < 2 else "Medium", reason=f"Commonly required for {payload.targetRole} roles.")
        for index, skill in enumerate(required)
        if skill.lower() not in current
    ]
    if not missing:
        missing = [SkillPriority(skill="Role-specific project depth", priority="Medium", reason="Your skills are close; stronger proof will differentiate you.")]
    return SkillGapResponse(
        targetRole=payload.targetRole,
        company=payload.company,
        summary=f"Your fastest path to {payload.targetRole} is to close {len(missing)} visible gaps and prove them through one focused project.",
        missingSkills=missing[:6],
        priorityRanking=[skill.skill for skill in missing[:6]],
        learningRecommendations=[
            f"Spend the next week building a small feature that demonstrates {missing[0].skill}.",
            "Update your resume skills section with only skills you can explain deeply.",
            "Compare three target job descriptions and track repeated keywords.",
        ],
        createdAt=now(),
    )


def fallback_roadmap(payload: RoadmapRequest) -> RoadmapResponse:
    weeks = max(2, payload.availableWeeks)
    first_build_week = max(2, weeks // 4)
    interview_week = max(first_build_week + 1, (weeks // 2) + 1)
    application_week = max(interview_week + 1, weeks - 2)
    return RoadmapResponse(
        targetRole=payload.targetRole,
        availableWeeks=weeks,
        hoursPerWeek=payload.hoursPerWeek,
        progress=15,
        summary=f"A {weeks}-week plan for {payload.targetRole}, balanced across fundamentals, proof projects, resume polish, and applications.",
        roadmap=[
            RoadmapStep(week=1, title="Baseline and targeting", focus="Audit skills and collect job descriptions", deliverable="Skill gap matrix", resources=["Target company job posts", "Resume analyzer"]),
            RoadmapStep(week=first_build_week, title="Flagship project sprint", focus="Build role-aligned proof of ability", deliverable="Deployed project with README", resources=["Official docs", "Architecture examples"]),
            RoadmapStep(week=interview_week, title="Technical story practice", focus="Prepare project deep dives and fundamentals", deliverable="Five STAR stories and system notes", resources=["DSA pattern list", "System design basics"]),
            RoadmapStep(week=application_week, title="Application sprint", focus="Tailor resume and apply in batches", deliverable="Tracked outreach pipeline", resources=["LinkedIn", "Company career pages"]),
        ],
        milestones=["80+ ATS resume score", "One shipped project", "Ten tailored applications", "Three project deep-dive stories"],
        createdAt=now(),
    )


def fallback_chat(payload: ChatRequest) -> ChatResponse:
    target_role = payload.profile.get("targetRole", "your target role")
    return ChatResponse(
        answer=f"For {target_role}, convert the question into proof: learn the concept, build a small artifact, then add a measurable resume bullet. A strong next move is to choose one skill and ship a visible project slice this week.",
        suggestedActions=[
            "Pick one target job description and highlight repeated skills.",
            "Create a two-hour study block and a two-hour build block.",
            "Ask the project analyzer to polish the result for your resume.",
        ],
        createdAt=now(),
    )


def fallback_project(payload: ProjectAnalysisRequest) -> ProjectAnalysisResponse:
    target_role = payload.targetRole or "your target role"
    return ProjectAnalysisResponse(
        summary=f"This project can signal stronger readiness for {target_role} by making impact, architecture, and scale explicit.",
        resumeImprovements=[
            "Rewrite the first bullet with user problem, technical action, and measurable result.",
            "Name the architecture: frontend, backend, database, auth, deployment, and AI/data pieces.",
            "Add a short tradeoff bullet explaining why you chose the main technologies.",
        ],
        scalabilitySuggestions=[
            "Add pagination, caching, and async processing for expensive workflows.",
            "Document error handling, logging, and monitoring for production use.",
            "Add CI checks, seeded demo data, and environment-specific configuration.",
        ],
        missingTechnologies=["Docker", "CI/CD", "Observability", "Cloud deployment"],
        createdAt=now(),
    )


def call_llm_json(prompt: str) -> dict[str, Any] | None:
    llm = build_llm()
    if llm is None:
        return None
    try:
        response = llm.invoke(prompt)
        content = getattr(response, "content", response)
        return extract_json(str(content))
    except Exception:
        return None


def build_llm() -> Any | None:
    if os.getenv("GEMINI_API_KEY"):
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            return ChatGoogleGenerativeAI(model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"), temperature=0.2)
        except Exception:
            return None
    if os.getenv("OPENAI_API_KEY"):
        try:
            from langchain_openai import ChatOpenAI

            return ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"), temperature=0.2)
        except Exception:
            return None
    return None


def extract_json(content: str) -> dict[str, Any] | None:
    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
    except json.JSONDecodeError:
        return None
    return parsed if isinstance(parsed, dict) else None


def count_action_verbs(words: list[str]) -> int:
    verbs = {
        "built",
        "led",
        "launched",
        "improved",
        "reduced",
        "increased",
        "designed",
        "implemented",
        "owned",
        "delivered",
        "created",
        "optimized",
    }
    counts = Counter(words)
    return sum(counts[verb] for verb in verbs)


def build_strengths(keyword_hits: set[str], skill_hits: set[str], number_count: int, action_verbs: int, word_count: int) -> list[str]:
    strengths: list[str] = []
    if keyword_hits:
        strengths.append("Resume includes career and ATS keywords relevant to student hiring screens.")
    if skill_hits:
        strengths.append("Technical skills are visible enough for automated parsing.")
    if number_count >= 3:
        strengths.append("Impact is supported with measurable outcomes.")
    if action_verbs >= 5:
        strengths.append("Experience bullets use strong action-oriented language.")
    if word_count >= 350:
        strengths.append("Resume has enough detail for recruiter review.")
    return strengths or ["Resume has a clear base structure for further optimization."]


def build_weaknesses(missing_keywords: list[str], missing_skills: list[str], number_count: int, word_count: int) -> list[str]:
    weaknesses: list[str] = []
    if missing_keywords:
        weaknesses.append("Several target keywords are missing or underrepresented.")
    if missing_skills:
        weaknesses.append("Technical skill coverage can be improved for modern software roles.")
    if number_count < 3:
        weaknesses.append("Impact statements need more metrics, percentages, or outcomes.")
    if word_count < 350:
        weaknesses.append("Resume may be too light for ATS and recruiter screening.")
    return weaknesses or ["No major structural weaknesses detected in this pass."]


def build_improvements(missing_keywords: list[str], missing_skills: list[str], number_count: int, word_count: int) -> list[str]:
    improvements = [
        f"Add role-relevant keywords such as {', '.join(missing_keywords[:4])}." if missing_keywords else "Tailor keywords to each target job description before applying.",
        f"Add or prove technical skills such as {', '.join(missing_skills[:4])}." if missing_skills else "Keep your technical skills grouped by language, framework, cloud, and database.",
        "Rewrite bullets with action, scope, metric, and business result.",
    ]
    if number_count < 3:
        improvements.append("Include at least three quantified achievements.")
    if word_count < 350:
        improvements.append("Expand recent projects with context, ownership, and implementation details.")
    return improvements


def parse_skill_priorities(value: Any, fallback: list[SkillPriority]) -> list[SkillPriority]:
    if not isinstance(value, list):
        return fallback
    parsed: list[SkillPriority] = []
    for item in value:
        if isinstance(item, dict):
            parsed.append(
                SkillPriority(
                    skill=str(item.get("skill") or "Role skill"),
                    priority=str(item.get("priority") or "Medium"),
                    reason=str(item.get("reason") or "Important for the target role."),
                )
            )
    return parsed or fallback


def parse_roadmap_steps(value: Any, fallback: list[RoadmapStep]) -> list[RoadmapStep]:
    if not isinstance(value, list):
        return fallback
    parsed: list[RoadmapStep] = []
    for item in value:
        if isinstance(item, dict):
            parsed.append(
                RoadmapStep(
                    week=clamp_int(item.get("week"), 1),
                    title=str(item.get("title") or "Learning sprint"),
                    focus=str(item.get("focus") or "Build role readiness"),
                    deliverable=str(item.get("deliverable") or "Completed milestone"),
                    resources=string_list(item.get("resources"), ["Official documentation"]),
                )
            )
    return parsed or fallback


def string_list(value: Any, fallback: list[str]) -> list[str]:
    if not isinstance(value, list):
        return fallback
    parsed = [str(item).strip() for item in value if str(item).strip()]
    return parsed or fallback


def clamp_int(value: Any, fallback: int) -> int:
    try:
        return max(0, min(100, int(value)))
    except (TypeError, ValueError):
        return fallback


def role_bucket(target_role: str) -> str:
    normalized = target_role.lower()
    for bucket in ROLE_SKILLS:
        if bucket in normalized:
            return bucket
    return "full stack"


def now() -> datetime:
    return datetime.now(timezone.utc)
