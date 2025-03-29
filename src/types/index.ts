
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuditResult {
  id: string;
  user_id: string;
  name: string;
  code: string;
  score: number;
  created_at: string;
  categories: AuditCategory[];
  summary: string;
}

export interface AuditCategory {
  name: string;
  score: number;
  max_score: number;
  description: string;
  issues: AuditIssue[];
}

export interface AuditIssue {
  title: string;
  description: string;
  severity: "high" | "medium" | "low" | "info" | "safe";
  code_reference?: string;
  recommendation: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
}
