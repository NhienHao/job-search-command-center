# API Overview — Job Search Command Center

Base URL: `{API_HOST}/api`  
Format: JSON · UTF-8  
Auth: không có (MVP single-user)

---

## Health

### `GET /health`

**Response 200**

```json
{ "status": "ok" }
```

---

## Applications

### `GET /api/applications`

List applications với filter và sort.

**Query params**

| Param | Type | Required | Mô tả |
|-------|------|----------|-------|
| `status` | enum | no | `applied`, `screening`, `interview`, `offer`, `rejected`, `on_hold` |
| `company` | string | no | Partial match `company_name` |
| `position` | string | no | Partial match `position` |
| `source` | string | no | Match `source` |
| `sort` | string | no | `applied_at` (default), `company_name`, `position`, `status`, `created_at` |
| `order` | string | no | `asc` \| `desc` (default `desc`) |

**Response 200**

```json
{
  "items": [
    {
      "id": "uuid",
      "company_name": "Acme Corp",
      "position": "Backend Engineer",
      "jd_url": "https://...",
      "job_type": "full_time",
      "location": "Remote",
      "salary": "3000-4000 USD",
      "expected_salary": null,
      "source": "linkedin",
      "status": "interview",
      "applied_at": "2026-06-01T00:00:00Z",
      "created_at": "2026-06-01T10:00:00Z",
      "updated_at": "2026-06-15T08:00:00Z"
    }
  ],
  "total": 1
}
```

---

### `POST /api/applications`

Tạo application mới.

**Request body**

```json
{
  "company_name": "Acme Corp",
  "position": "Backend Engineer",
  "jd_url": "https://jobs.example.com/123",
  "job_type": "full_time",
  "location": "Ho Chi Minh City",
  "salary": "3000 USD",
  "expected_salary": "3500 USD",
  "source": "linkedin",
  "status": "applied",
  "applied_at": "2026-06-01T00:00:00Z"
}
```

| Field | Required |
|-------|----------|
| `company_name`, `position`, `job_type`, `source` | yes |
| `jd_url`, `location`, `salary`, `expected_salary` | no |
| `status` | no (default `applied`) |
| `applied_at` | no (default `now()`) |

**Response 201** — object application (cùng shape item ở list).

**Response 422** — validation error.

---

### `GET /api/applications/{id}`

**Response 200** — application object.

**Response 404** — không tìm thấy.

---

### `PATCH /api/applications/{id}`

Cập nhật một phần — dùng cho sửa thông tin hoặc đổi `status`.

**Request body** (tất cả optional, gửi field cần đổi)

```json
{
  "status": "interview",
  "position": "Senior Backend Engineer"
}
```

**Response 200** — application object đã cập nhật.

**Response 404** — không tìm thấy.

---

### `DELETE /api/applications/{id}`

Xóa application và toàn bộ notes (cascade).

**Response 204** — no body.

**Response 404** — không tìm thấy.

---

## Notes

Nested dưới application; update/delete qua id note.

### `GET /api/applications/{application_id}/notes`

**Response 200**

```json
{
  "items": [
    {
      "id": "uuid",
      "application_id": "uuid",
      "note_type": "interview",
      "content": "Round 1 with HR — system design focus",
      "event_at": "2026-06-10T14:00:00Z",
      "interview_completed": true,
      "created_at": "2026-06-08T09:00:00Z",
      "updated_at": "2026-06-10T15:30:00Z"
    }
  ],
  "total": 1
}
```

**Response 404** — application không tồn tại.

---

### `POST /api/applications/{application_id}/notes`

**Request body**

```json
{
  "note_type": "interview",
  "content": "Round 2 scheduled with engineering manager",
  "event_at": "2026-06-20T10:00:00Z",
  "interview_completed": false
}
```

| Field | Required |
|-------|----------|
| `note_type`, `content` | yes |
| `event_at`, `interview_completed` | no |

**Response 201** — note object.

**Response 404** — application không tồn tại.

**Response 422** — `interview_completed` set khi `note_type != interview`.

---

### `PATCH /api/notes/{id}`

**Request body** (optional fields)

```json
{
  "content": "Updated feedback from HM",
  "interview_completed": true
}
```

**Response 200** — note object.

**Response 404** — không tìm thấy.

---

### `DELETE /api/notes/{id}`

**Response 204** — no body.

**Response 404** — không tìm thấy.

---

## Dashboard

### `GET /api/dashboard/summary`

**Response 200**

```json
{
  "total_applications": 42,
  "by_status": {
    "applied": 10,
    "screening": 5,
    "interview": 8,
    "offer": 2,
    "rejected": 15,
    "on_hold": 2
  },
  "interviews_conducted": 12
}
```

| Field | Cách tính |
|-------|-----------|
| `total_applications` | `COUNT(job_applications)` |
| `by_status.*` | `GROUP BY status` |
| `interviews_conducted` | `COUNT(application_notes)` WHERE `note_type = interview` AND `interview_completed = true` |

---

## Error response (chung)

```json
{ "detail": "Application not found" }
```

Hoặc mảng validation (422):

```json
{
  "detail": [
    { "loc": ["body", "company_name"], "msg": "field required", "type": "value_error.missing" }
  ]
}
```

---

## CORS

Backend allow:

- `http://localhost:5173` (Vite dev)
- Origin frontend production từ `CORS_ORIGINS`

Methods: `GET`, `POST`, `PATCH`, `DELETE`, `OPTIONS`  
Headers: `Content-Type`
