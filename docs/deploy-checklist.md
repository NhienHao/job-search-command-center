# Deploy checklist — Job Search Command Center (MVP)

Stack: **Railway** (FastAPI + PostgreSQL) + **Vercel** (React/Vite). Không auth, single-user.

---

## 1. Checklist nhanh

### A. Chuẩn bị repo

- [ ] Code đã push lên GitHub (Railway + Vercel kết nối repo).
- [ ] Local chạy được: `alembic upgrade head`, `uvicorn`, `npm run build`.
- [ ] Không commit file `.env` (chỉ `.env.example`).

### B. Railway — PostgreSQL

- [ ] Tạo project Railway → **Add PostgreSQL**.
- [ ] Ghi lại connection string (Railway variable `DATABASE_URL` trên Postgres service).

### C. Railway — Backend

- [ ] **Add Service** → Deploy from GitHub repo.
- [ ] **Root Directory:** `backend`
- [ ] **Start Command** (xem mục 3).
- [ ] Env vars (xem mục 2).
- [ ] **Chạy migration một lần** trước khi dùng app (xem mục 3).
- [ ] Ghi lại public URL backend, ví dụ `https://xxx.up.railway.app`.

### D. Vercel — Frontend

- [ ] Import repo → **Root Directory:** `frontend`
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `dist`
- [ ] Env `VITE_API_BASE_URL` = URL Railway backend (không slash cuối).
- [ ] File `frontend/vercel.json` có sẵn (SPA routing cho `/dashboard`).
- [ ] Deploy → ghi URL Vercel, ví dụ `https://xxx.vercel.app`.

### E. CORS (sau khi có URL Vercel)

- [ ] Trên Railway backend: cập nhật `CORS_ORIGINS` = URL Vercel production.
- [ ] Redeploy backend nếu đổi CORS.

### F. Verify production

- [ ] `GET {BACKEND}/api/health` → `{"status":"ok"}`
- [ ] `GET {BACKEND}/api/health/db` → `{"database":"ok"}`
- [ ] Mở Vercel → list applications load được.
- [ ] Tạo/sửa application + note.
- [ ] `/dashboard` refresh trực tiếp không 404.

---

## 2. Environment variables

### Backend (Railway)

| Biến | Bắt buộc | Ví dụ / ghi chú |
|------|----------|-----------------|
| `DATABASE_URL` | Có | Reference từ Postgres service Railway. Nếu bắt đầu bằng `postgres://`, đổi thành `postgresql://` (SQLAlchemy + psycopg2). |
| `CORS_ORIGINS` | Khuyến nghị | `https://job-search-command-center-rose.vercel.app` — nhiều origin cách nhau bằng dấu phẩy. Thêm `http://localhost:5173` nếu dev local. |
| `CORS_ORIGIN_REGEX` | Không (có default) | Mặc định trong code: `https://job-search-command-center.*\.vercel\.app` — cover preview deploy Vercel. |
| `BACKEND_ENV` | Không | `production` (tham chiếu, app không branch logic theo biến này hiện tại). |
| `BACKEND_PORT` | Không | Railway inject `PORT`; uvicorn dùng `$PORT`, không cần set `BACKEND_PORT`. |

**Không cần** thêm secret/auth cho MVP.

### Frontend (Vercel)

| Biến | Bắt buộc | Ví dụ / ghi chú |
|------|----------|-----------------|
| `VITE_API_BASE_URL` | Có | `https://xxx.up.railway.app` — **không** có `/` cuối. Build-time: đổi biến → redeploy frontend. |

Tham chiếu local: `backend/.env.example`, `frontend/.env.example`.

---

## 3. Build & start commands

### Backend — Railway

| Mục | Giá trị |
|-----|---------|
| **Root Directory** | `backend` |
| **Install** | Tự detect Python; Railway/Nixpacks chạy `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Health check** (tuỳ chọn) | Path: `/api/health` |

**Migration (chạy trước lần đầu hoặc sau mỗi release có migration mới):**

Railway → backend service → **Shell** hoặc one-off command:

```bash
cd /app   # hoặc thư mục backend tùy image
alembic upgrade head
```

Hoặc local với `DATABASE_URL` production (cẩn thận):

```bash
cd backend
# set DATABASE_URL trỏ Railway Postgres
alembic upgrade head
```

**Thứ tự:** Postgres sống → migration `upgrade head` → start uvicorn.

### Frontend — Vercel

| Mục | Giá trị |
|-----|---------|
| **Root Directory** | `frontend` |
| **Install** | `npm install` (mặc định) |
| **Build** | `npm run build` (`tsc -b && vite build`) |
| **Output** | `dist` |

Không có start command — Vercel serve static files.

---

## 4. CORS & production URLs

Luồng URL:

```
Browser → https://<app>.vercel.app          (frontend)
       → https://<api>.up.railway.app/api/... (backend)
       → PostgreSQL (Railway, private)
```

**Backend** (`app/config.py`): `CORS_ORIGINS` split theo dấu phẩy → `CORSMiddleware` trong `app/main.py`.

Production tối thiểu:

```env
CORS_ORIGINS=https://your-app.vercel.app
```

**Frontend:** `VITE_API_BASE_URL` trỏ đúng Railway URL. Client gọi `{VITE_API_BASE_URL}/api/...` (xem `frontend/src/api/client.ts`).

**Lưu ý:**

- Đổi URL Vercel (preview/production) → cập nhật `CORS_ORIGINS` tương ứng.
- Preview deploy Vercel có domain riêng — thêm origin vào `CORS_ORIGINS` nếu cần test preview.

---

## 5. File cấu hình deploy

| File | Cần? | Mục đích |
|------|------|----------|
| `frontend/vercel.json` | **Có** | Rewrite SPA — `/dashboard` refresh không 404 |
| `backend/requirements.txt` | Đã có | Dependencies Python |
| `backend/alembic/` | Đã có | Migrations production |
| `railway.toml` / `Procfile` | **Không** (MVP) | Cấu hình Start Command trên Railway UI là đủ |
| `Dockerfile` | **Không** (MVP) | Railway Nixpacks build tự động |

Nội dung `frontend/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 6. Thứ tự làm (tóm tắt)

1. Push code lên GitHub.
2. Railway: tạo **PostgreSQL** → lấy `DATABASE_URL`.
3. Railway: tạo **backend service** (root `backend`, start uvicorn).
4. Set env backend: `DATABASE_URL`, `CORS_ORIGINS` tạm `http://localhost:5173` hoặc để trống origin dev nếu chưa có Vercel.
5. **Chạy `alembic upgrade head`** trên DB production.
6. Verify backend: `/api/health`, `/api/health/db`.
7. Vercel: deploy frontend (root `frontend`), set `VITE_API_BASE_URL` = URL Railway.
8. Lấy URL Vercel → cập nhật `CORS_ORIGINS` trên Railway → redeploy backend.
9. Verify end-to-end trên Vercel.

---

## 7. Verify sau deploy

### Backend (curl hoặc browser)

```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/health
# {"status":"ok"}

curl https://YOUR-RAILWAY-URL.up.railway.app/api/health/db
# {"database":"ok"}

curl https://YOUR-RAILWAY-URL.up.railway.app/api/applications
# [] hoặc danh sách JSON
```

### Frontend

1. Mở URL Vercel → trang Applications.
2. Tạo 1 application → không lỗi CORS trong DevTools Network.
3. Mở `/dashboard` → số liệu load; **F5** trang vẫn OK (nhờ `vercel.json`).
4. Thêm note trên application → `GET /api/applications/{id}/notes` thành công.

### Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
|-------------|-------------|------------|
| CORS error trên browser | `CORS_ORIGINS` thiếu/sai URL Vercel | Sửa env Railway, redeploy |  
| `503` `/api/health/db` | DB chưa chạy / sai `DATABASE_URL` / chưa migrate | Kiểm tra Postgres + `alembic upgrade head` |
| Frontend gọi `localhost:8000` | Thiếu hoặc sai `VITE_API_BASE_URL` khi build | Set env Vercel, **redeploy** |
| `/dashboard` 404 khi refresh | Thiếu SPA rewrite | Thêm `frontend/vercel.json` |
| `500` khi list apps | Bảng chưa tồn tại | Chạy migration |

---

## 8. Redeploy nhanh (sau thay đổi code)

| Thay đổi | Hành động |
|----------|-----------|
| Backend code / model mới | Push → Railway auto deploy → `alembic upgrade head` nếu có migration mới |
| Chỉ env backend | Railway Variables → redeploy |
| Frontend code | Push → Vercel auto deploy |
| Đổi API URL | Sửa `VITE_API_BASE_URL` → redeploy Vercel |

Chi tiết kiến trúc: [`architecture.md`](architecture.md). API: [`api-overview.md`](api-overview.md). Local env: [`environment.md`](environment.md).
