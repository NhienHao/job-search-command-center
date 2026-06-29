import { useEffect, useState } from "react";

import { createApplication, updateApplication } from "../api/applications";
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  type Application,
  type ApplicationCreateInput,
  type ApplicationStatus,
  type ApplicationUpdateInput,
  type JobType,
} from "../types/application";
import { toDatetimeLocalValue } from "../utils/datetime";
import { formatEnumLabel } from "../utils/format";

interface FormState {
  company_name: string;
  position: string;
  job_type: JobType;
  source: string;
  jd_url: string;
  location: string;
  salary: string;
  expected_salary: string;
  status: ApplicationStatus;
  applied_at: string;
}

const EMPTY_FORM: FormState = {
  company_name: "",
  position: "",
  job_type: "full_time",
  source: "",
  jd_url: "",
  location: "",
  salary: "",
  expected_salary: "",
  status: "applied",
  applied_at: "",
};

function formFromApplication(application: Application): FormState {
  return {
    company_name: application.company_name,
    position: application.position,
    job_type: application.job_type,
    source: application.source,
    jd_url: application.jd_url ?? "",
    location: application.location ?? "",
    salary: application.salary ?? "",
    expected_salary: application.expected_salary ?? "",
    status: application.status,
    applied_at: toDatetimeLocalValue(application.applied_at),
  };
}

function optionalString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function buildCreatePayload(form: FormState): ApplicationCreateInput {
  const payload: ApplicationCreateInput = {
    company_name: form.company_name.trim(),
    position: form.position.trim(),
    job_type: form.job_type,
    source: form.source.trim(),
    status: form.status,
  };

  const jdUrl = optionalString(form.jd_url);
  const location = optionalString(form.location);
  const salary = optionalString(form.salary);
  const expectedSalary = optionalString(form.expected_salary);

  if (jdUrl) payload.jd_url = jdUrl;
  if (location) payload.location = location;
  if (salary) payload.salary = salary;
  if (expectedSalary) payload.expected_salary = expectedSalary;
  if (form.applied_at.trim()) {
    payload.applied_at = new Date(form.applied_at).toISOString();
  }

  return payload;
}

function buildUpdatePayload(
  form: FormState,
  initial: Application,
): ApplicationUpdateInput {
  const payload: ApplicationUpdateInput = {};
  const createPayload = buildCreatePayload(form);

  if (createPayload.company_name !== initial.company_name) {
    payload.company_name = createPayload.company_name;
  }
  if (createPayload.position !== initial.position) {
    payload.position = createPayload.position;
  }
  if (createPayload.job_type !== initial.job_type) {
    payload.job_type = createPayload.job_type;
  }
  if (createPayload.source !== initial.source) {
    payload.source = createPayload.source;
  }
  if (createPayload.status !== initial.status) {
    payload.status = createPayload.status;
  }

  const nextJdUrl = optionalString(form.jd_url);
  if (nextJdUrl !== initial.jd_url) payload.jd_url = nextJdUrl;

  const nextLocation = optionalString(form.location);
  if (nextLocation !== initial.location) payload.location = nextLocation;

  const nextSalary = optionalString(form.salary);
  if (nextSalary !== initial.salary) payload.salary = nextSalary;

  const nextExpectedSalary = optionalString(form.expected_salary);
  if (nextExpectedSalary !== initial.expected_salary) {
    payload.expected_salary = nextExpectedSalary;
  }

  const initialAppliedAt = toDatetimeLocalValue(initial.applied_at);
  if (form.applied_at.trim() && form.applied_at !== initialAppliedAt) {
    payload.applied_at = new Date(form.applied_at).toISOString();
  }

  return payload;
}

interface ApplicationFormProps {
  mode: "create" | "edit";
  initialValue?: Application;
  onSubmitSuccess: () => void;
  onCancel?: () => void;
}

export function ApplicationForm({
  mode,
  initialValue,
  onSubmitSuccess,
  onCancel,
}: ApplicationFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && initialValue) {
      setForm(formFromApplication(initialValue));
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
    setFieldErrors({});
  }, [mode, initialValue]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!form.company_name.trim()) errors.company_name = "Required";
    if (!form.position.trim()) errors.position = "Required";
    if (!form.source.trim()) errors.source = "Required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      if (mode === "create") {
        await createApplication(buildCreatePayload(form));
      } else if (initialValue) {
        const payload = buildUpdatePayload(form, initialValue);
        if (Object.keys(payload).length === 0) {
          onSubmitSuccess();
          return;
        }
        await updateApplication(initialValue.id, payload);
      }
      onSubmitSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="application-form-card">
      <header className="form-card-header">
        <h2>{mode === "create" ? "New application" : "Edit application"}</h2>
        {mode === "edit" && onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            New application
          </button>
        )}
      </header>

      <form className="application-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Company *
            <input
              type="text"
              value={form.company_name}
              onChange={(event) => updateField("company_name", event.target.value)}
            />
            {fieldErrors.company_name && (
              <span className="field-error">{fieldErrors.company_name}</span>
            )}
          </label>

          <label>
            Position *
            <input
              type="text"
              value={form.position}
              onChange={(event) => updateField("position", event.target.value)}
            />
            {fieldErrors.position && (
              <span className="field-error">{fieldErrors.position}</span>
            )}
          </label>

          <label>
            Job type *
            <select
              value={form.job_type}
              onChange={(event) =>
                updateField("job_type", event.target.value as JobType)
              }
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatEnumLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Source *
            <input
              type="text"
              value={form.source}
              placeholder="ITviec, LinkedIn, referral…"
              onChange={(event) => updateField("source", event.target.value)}
            />
            {fieldErrors.source && (
              <span className="field-error">{fieldErrors.source}</span>
            )}
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value as ApplicationStatus)
              }
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatEnumLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Applied at
            <input
              type="datetime-local"
              value={form.applied_at}
              onChange={(event) => updateField("applied_at", event.target.value)}
            />
          </label>

          <label className="form-span-2">
            JD URL
            <input
              type="url"
              value={form.jd_url}
              placeholder="Full job posting link (paste long URLs here)"
              onChange={(event) => updateField("jd_url", event.target.value)}
            />
          </label>

          <label>
            Location
            <input
              type="text"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </label>

          <label>
            Salary
            <input
              type="text"
              value={form.salary}
              onChange={(event) => updateField("salary", event.target.value)}
            />
          </label>

          <label>
            Expected salary
            <input
              type="text"
              value={form.expected_salary}
              onChange={(event) =>
                updateField("expected_salary", event.target.value)
              }
            />
          </label>
        </div>

        {error && <p className="status-message error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting
              ? "Saving…"
              : mode === "create"
                ? "Create application"
                : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
