import { APPLICATION_STATUSES, type ApplicationFilterParams } from "../types/application";

interface ApplicationFiltersProps {
  filters: ApplicationFilterParams;
  onChange: (filters: ApplicationFilterParams) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ApplicationFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: ApplicationFiltersProps) {
  return (
    <form
      className="filters"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <div className="filters-grid">
        <label>
          Status
          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value
                  ? (event.target.value as ApplicationFilterParams["status"])
                  : undefined,
              })
            }
          >
            <option value="">All</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label>
          Company
          <input
            type="text"
            value={filters.company ?? ""}
            placeholder="Search company"
            onChange={(event) =>
              onChange({ ...filters, company: event.target.value })
            }
          />
        </label>

        <label>
          Position
          <input
            type="text"
            value={filters.position ?? ""}
            placeholder="Search position"
            onChange={(event) =>
              onChange({ ...filters, position: event.target.value })
            }
          />
        </label>

        <label>
          Source
          <input
            type="text"
            value={filters.source ?? ""}
            placeholder="e.g. linkedin"
            onChange={(event) =>
              onChange({ ...filters, source: event.target.value })
            }
          />
        </label>
      </div>

      <div className="filters-actions">
        <button type="submit" className="btn btn-primary">
          Apply filters
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
