import { useCallback, useEffect, useState } from "react";

import { fetchDashboardSummary } from "../api/dashboard";
import {
  DASHBOARD_STATUS_ORDER,
  type DashboardSummary,
} from "../types/dashboard";

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err) {
      setSummary(null);
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  return (
    <section className="dashboard-page">
      <header className="page-header dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Job search overview</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void loadSummary()}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      {loading && !summary && (
        <p className="status-message">Loading dashboard…</p>
      )}
      {error && <p className="status-message error">{error}</p>}

      {summary && (
        <>
          <section className="dashboard-overview">
            <h2>Overview</h2>
            <div className="dashboard-cards">
              <article className="dashboard-card">
                <p className="dashboard-card-label">Total applications</p>
                <p className="dashboard-card-value">{summary.totalApplications}</p>
              </article>
              <article className="dashboard-card">
                <p className="dashboard-card-label">Interviews conducted</p>
                <p className="dashboard-card-value">{summary.interviewsConducted}</p>
              </article>
            </div>
          </section>

          <section className="dashboard-by-status">
            <h2>By status</h2>
            <div className="table-wrap">
              <table className="dashboard-status-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {DASHBOARD_STATUS_ORDER.map((status) => (
                    <tr key={status}>
                      <td>
                        <span className={`status-badge status-${status}`}>
                          {formatStatusLabel(status)}
                        </span>
                      </td>
                      <td>{summary.byStatus[status]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
