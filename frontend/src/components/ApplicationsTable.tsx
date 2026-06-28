import type { Application } from "../types/application";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

interface ApplicationsTableProps {
  items: Application[];
}

export function ApplicationsTable({ items }: ApplicationsTableProps) {
  if (items.length === 0) {
    return <p className="empty-state">No applications found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="applications-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {items.map((app) => (
            <tr key={app.id}>
              <td data-label="Company">{app.company_name}</td>
              <td data-label="Position">{app.position}</td>
              <td data-label="Status">
                <span className={`status-badge status-${app.status}`}>
                  {formatStatus(app.status)}
                </span>
              </td>
              <td data-label="Applied">{formatDate(app.applied_at)}</td>
              <td data-label="Source">{app.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
