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
  selectedId?: string | null;
  onEdit: (application: Application) => void;
}

export function ApplicationsTable({
  items,
  selectedId,
  onEdit,
}: ApplicationsTableProps) {
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
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((app) => (
            <tr
              key={app.id}
              className={selectedId === app.id ? "row-selected" : undefined}
            >
              <td data-label="Company">{app.company_name}</td>
              <td data-label="Position">{app.position}</td>
              <td data-label="Status">
                <span className={`status-badge status-${app.status}`}>
                  {formatStatus(app.status)}
                </span>
              </td>
              <td data-label="Applied">{formatDate(app.applied_at)}</td>
              <td data-label="Source">{app.source}</td>
              <td data-label="Actions" className="actions-cell">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(app)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
