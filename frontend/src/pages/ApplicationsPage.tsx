import { useCallback, useEffect, useState } from "react";

import { fetchApplications } from "../api/applications";
import { ApplicationFilters } from "../components/ApplicationFilters";
import { ApplicationForm } from "../components/ApplicationForm";
import { ApplicationsTable } from "../components/ApplicationsTable";
import { NotesPanel } from "../components/NotesPanel";
import type { Application, ApplicationFilterParams } from "../types/application";

const DEFAULT_FILTERS: ApplicationFilterParams = {
  sort: "applied_at",
  order: "desc",
};

export function ApplicationsPage() {
  const [draftFilters, setDraftFilters] =
    useState<ApplicationFilterParams>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ApplicationFilterParams>(DEFAULT_FILTERS);
  const [items, setItems] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(
    null,
  );

  const loadApplications = useCallback(async (filters: ApplicationFilterParams) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApplications(filters);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications(appliedFilters);
  }, [appliedFilters, loadApplications]);

  function handleFormSuccess() {
    setSelectedApplication(null);
    void loadApplications(appliedFilters);
  }

  function handleSelectApplication(application: Application) {
    setSelectedApplication(application);
  }

  return (
    <section className="applications-page">
      <header className="page-header">
        <h1>Applications</h1>
        <p className="page-subtitle">
          {loading ? "Loading…" : `${total} application${total === 1 ? "" : "s"}`}
        </p>
      </header>

      <div className="applications-layout">
        <div className="applications-main">
          <ApplicationForm
            mode={selectedApplication ? "edit" : "create"}
            initialValue={selectedApplication ?? undefined}
            onSubmitSuccess={handleFormSuccess}
            onCancel={() => setSelectedApplication(null)}
          />

          <ApplicationFilters
            filters={draftFilters}
            onChange={setDraftFilters}
            onApply={() => setAppliedFilters({ ...draftFilters })}
            onReset={() => {
              setDraftFilters(DEFAULT_FILTERS);
              setAppliedFilters(DEFAULT_FILTERS);
            }}
          />

          {loading && <p className="status-message">Loading applications…</p>}
          {error && <p className="status-message error">{error}</p>}
          {!loading && !error && (
            <ApplicationsTable
              items={items}
              selectedId={selectedApplication?.id}
              onEdit={handleSelectApplication}
            />
          )}
        </div>

        <NotesPanel application={selectedApplication} />
      </div>
    </section>
  );
}
