export const APPLICATION_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "on_hold",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const JOB_TYPES = ["full_time", "internship", "freelance"] as const;

export type JobType = (typeof JOB_TYPES)[number];

export interface Application {
  id: string;
  company_name: string;
  position: string;
  jd_url: string | null;
  job_type: JobType;
  location: string | null;
  salary: string | null;
  expected_salary: string | null;
  source: string;
  status: ApplicationStatus;
  applied_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationListResponse {
  items: Application[];
  total: number;
}

export interface ApplicationFilterParams {
  status?: ApplicationStatus;
  company?: string;
  position?: string;
  source?: string;
  sort?: "applied_at" | "company_name" | "position" | "status" | "created_at";
  order?: "asc" | "desc";
}
