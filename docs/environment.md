# Environment — Local development

Hướng dẫn cấu hình env và Postgres local cho backend. Generic, không phụ thuộc business schema.

---

## Backend env variables

Copy `backend/.env.example` → `backend/.env`. Backend đọc file `.env` khi khởi động (pydantic-settings).

| Variable | Default (local) | Mục đích |
|----------|-----------------|----------|
| `BACKEND_ENV` | `local` | Môi trường chạy app |
| `BACKEND_PORT` | `8000` | Port uvicorn local (tham chiếu; uvicorn vẫn truyền `--port`) |
| `DATABASE_URL` | xem `.env.example` | Postgres connection string |
| `CORS_ORIGINS` | `http://localhost:5173` | Frontend origins (comma-separated) |

### `DATABASE_URL` format

```
postgresql://<user>:<password>@<host>:<port>/<database>
```

Local default:

```
postgresql://postgres:postgres@localhost:5432/job_search_command_center_local
```

| Part | Local default |
|------|---------------|
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | `postgres` |
| Database | `job_search_command_center_local` |

### Settings classes (`backend/app/config.py`)

- `AppSettings` — `BACKEND_ENV`, `BACKEND_PORT`, `CORS_ORIGINS`
- `DatabaseSettings` — `DATABASE_URL`
- `settings.app` / `settings.database` — entry point dùng trong code

---

## Postgres local với Docker (Windows)

Giả định: chưa cài Postgres native, đã có Docker Desktop.

### 1. Tạo thư mục dữ liệu

```powershell
mkdir C:\docker\job-search-command-center-postgres
```

### 2. Pull image (nếu chưa có)

Dùng `postgres:16` — ổn định và tương thích mount `-v ...:/var/lib/postgresql/data` trên Windows.

```powershell
docker pull postgres:16
```

### 3. Chạy container

```powershell
docker run --name job-search-command-center-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_DB=job_search_command_center_local `
  -p 5432:5432 `
  -v C:\docker\job-search-command-center-postgres:/var/lib/postgresql/data `
  -d postgres:16
```

Container name: `job-search-command-center-postgres`  
DB name khớp `DATABASE_URL` trong `.env.example`.

**Port 5432 đã bị chiếm?** (Postgres native hoặc container khác) Dùng host port `5433`:

```powershell
docker run --name job-search-command-center-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_DB=job_search_command_center_local `
  -p 5433:5432 `
  -v C:\docker\job-search-command-center-postgres:/var/lib/postgresql/data `
  -d postgres:16
```

Và cập nhật `.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/job_search_command_center_local
```

**Lưu ý:** `postgres:latest` (18+) đổi cách mount volume; dùng `postgres:16` với `-v ...:/var/lib/postgresql/data` như trên.

**Container đã tồn tại?** Start lại:

```powershell
docker start job-search-command-center-postgres
```

### 4. Cấu hình `.env`

```powershell
cd backend
copy .env.example .env
```

Chỉnh `DATABASE_URL` nếu đổi port, user, password, hoặc tên database.

### 5. Chạy backend

```powershell
cd backend
.venv\Scripts\uvicorn app.main:app --reload --port 8000
```

---

## Health checks

| Endpoint | Ý nghĩa | OK response |
|----------|---------|-------------|
| `GET /api/health` | App đang chạy | `{"status":"ok"}` |
| `GET /api/health/db` | Kết nối Postgres | `{"database":"ok"}` |

DB lỗi → `503` với body:

```json
{
  "detail": {
    "database": "error",
    "message": "..."
  }
}
```

### Verify nhanh (PowerShell)

```powershell
Invoke-RestMethod http://localhost:8000/api/health
Invoke-RestMethod http://localhost:8000/api/health/db
```

---

## Ghi chú

- Step 3.2 chỉ wire engine/session; **chưa có business tables**.
- Alembic migrations → Step 3.3.
- Không commit file `.env` (đã có trong `.gitignore`).
