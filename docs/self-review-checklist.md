# Self-review checklist — Job Search Command Center MVP

Dùng file này để tự kiểm tra trước khi deploy. **Chỉ có câu hỏi** — hãy tự trả lời bằng lời hoặc viết ra giấy.

---

## 1. Kiến trúc tổng quan

- Khi bạn mở trang Applications trên browser, request đi qua những layer nào từ UI đến database và ngược lại?
- Frontend và backend trong repo này nằm ở thư mục nào, chạy trên port nào khi dev local?
- Vì sao MVP tách React (Vite) và FastAPI thành hai service thay vì một monolith?
- Deploy mục tiêu đặt frontend ở đâu và backend + Postgres ở đâu?
- Biến môi trường nào trên frontend trỏ tới API backend? Biến nào trên backend cho phép frontend gọi được API?
- Health check app (`GET /api/health`) và health check DB (`GET /api/health/db`) khác nhau ở điểm nào?
- MVP có user auth không? Rủi ro gì khi đặt URL public lên CV mà không có login?

---

## 2. Database & ERD

- Entity gốc của MVP là bảng nào? Mọi ghi chú gắn với nó qua khóa nào?
- Bảng `job_applications` lưu những thông tin gì về một lần ứng tuyển (công ty, vị trí, nguồn, pipeline, …)?
- Enum `application_status` có những giá trị nào và thứ tự pipeline ý nghĩa ra sao trong thực tế xin việc?
- Enum `job_type` gồm những loại job nào?
- Bảng `application_notes` có những cột chính nào? FK tới `job_applications` cấu hình ON DELETE thế nào?
- Enum `note_type` gồm những giá trị nào và mỗi loại dùng để ghi lại điều gì?
- Field `interview_completed` chỉ có ý nghĩa khi nào? Backend validate rule này thế nào?
- Vì sao `applied_at` nằm trên application thay vì chỉ lưu trong note `apply`?

---

## 3. Flow API

- `GET /api/applications` nhận những query param filter/sort nào? Response shape là gì?
- Tạo application mới gọi method và path nào? Field nào bắt buộc, field nào optional, default của `status` và `applied_at` là gì?
- Cập nhật một phần application (ví dụ đổi status sang `interview`) dùng endpoint nào?
- Xóa application trả status code gì? Notes liên quan xử lý thế nào ở DB?
- List và tạo notes cho một application dùng path nào? Update và delete một note dùng path nào?
- Khi nào API notes trả `404`? Khi nào trả `422` liên quan `interview_completed`?
- `GET /api/dashboard/summary` trả những field nào trong JSON?
- `total_applications`, `by_status`, và `interviews_conducted` được tính từ bảng/điều kiện nào?
- Trong flow create application, update note, và delete application — status code 200, 201, 204, 404, 422 xuất hiện ở tình huống nào?

---

## 4. Frontend integration

- Trang `/` (ApplicationsPage) fetch danh sách application bằng hàm API nào, ở file nào?
- Filter trên UI (status, company, position, source) map sang query params backend thế nào?
- Làm sao để chọn một application để vừa edit form application vừa xem NotesPanel?
- ApplicationForm phân biệt mode create và edit như thế nào? Sau submit thành công thì list được refresh ra sao?
- NotesPanel fetch notes khi nào? Nếu chưa chọn application thì UI hiển thị gì?
- Tạo note interview với checkbox “Interview completed” feed vào metric nào trên dashboard?
- DashboardPage (`/dashboard`) gọi API nào và map snake_case response sang TypeScript types thế nào?
- Trên frontend, bạn xử lý các trạng thái loading, error, và empty list ở đâu (applications, notes, dashboard)?

---

## 5. Deploy & thêm feature sau này

- Backend trên Railway cần những biến env tối thiểu nào (`DATABASE_URL`, `CORS_ORIGINS`, …)?
- Frontend trên Vercel cần biến env nào để gọi đúng API production?
- `CORS_ORIGINS` trên backend phải chứa URL nào để trình duyệt từ Vercel không bị chặn?
- Lệnh start backend production thường là gì (uvicorn)? Postgres trên Railway kết nối qua biến nào?
- Build frontend production chạy lệnh gì? Output build nằm ở đâu?
- Nếu thêm một field mới trên `job_applications` (ví dụ `referral_contact`), bạn sẽ sửa theo thứ tự nào: docs → model → migration → schema → service → router → frontend types → API client → UI?
- Nếu thêm một `note_type` mới, những layer nào bắt buộc phải đồng bộ (ERD, enum DB, Pydantic, frontend select, validation rules)?
