export interface FormattingAnalysis {
  score: number;
  readability: "Excellent" | "Good" | "Needs Improvement" | "Poor";
  detectedIssues: string[];
  recommendations: string[];
}

export interface KeywordDensityAnalysis {
  foundKeywords: string[];
  missingKeywordsTunisianMarket: string[];
}

export interface AtsParseResult {
  atsScore: number;
  candidateName?: string;
  professionalTitle?: string;
  summary: string;
  extractedSkills: string[];
  experienceYearsEst: number;
  experienceLevel: "Junior" | "Mid-Level" | "Senior" | "Lead";
  formattingAnalysis: FormattingAnalysis;
  keywordDensity: KeywordDensityAnalysis;
  strengths: string[];
  areasForImprovement: string[];
  analyzedAt: string;
}

export interface JobCompatibilityResult {
  jobId?: string;
  jobTitle: string;
  predictedMatchScore: number;
  matchGrade: "Très Élevé" | "Élevé" | "Bon" | "Moyen" | "Faible";
  matchingSkills: string[];
  missingSkills: string[];
  hiringProbability: number;
  tailoredAdvice: string;
}
