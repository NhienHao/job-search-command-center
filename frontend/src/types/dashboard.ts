export interface DashboardByStatus {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
  on_hold: number;
}

export interface DashboardSummary {
  totalApplications: number;
  byStatus: DashboardByStatus;
  interviewsConducted: number;
}

export const DASHBOARD_STATUS_ORDER: (keyof DashboardByStatus)[] = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "on_hold",
];

interface DashboardSummaryResponse {
  total_applications: number;
  by_status: Partial<DashboardByStatus>;
  interviews_conducted: number;
}

export function mapDashboardSummary(
  data: DashboardSummaryResponse,
): DashboardSummary {
  return {
    totalApplications: data.total_applications,
    byStatus: {
      applied: data.by_status.applied ?? 0,
      screening: data.by_status.screening ?? 0,
      interview: data.by_status.interview ?? 0,
      offer: data.by_status.offer ?? 0,
      rejected: data.by_status.rejected ?? 0,
      on_hold: data.by_status.on_hold ?? 0,
    },
    interviewsConducted: data.interviews_conducted,
  };
}
