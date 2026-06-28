# Prompt — Requirements docs

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 1 — Requirements docs

Tôi sẽ dán mô tả ý thô bên dưới.
Hãy viết lại thành 3 file markdown ngắn gọn, rõ ràng, không lan scope:

1. docs/mvp-scope.md
- Mô tả sản phẩm ngắn gọn
- Người dùng mục tiêu
- Mục tiêu MVP
- Out-of-scope rõ ràng
- Tech stack dự kiến

2. docs/user-stories.md
- Chỉ giữ user stories thật sự cần cho MVP
- Format: As a [user], I want [action], so that [benefit]

3. docs/feature-list.md
- Chia Must-have / Nice-to-have / Out-of-scope

Yêu cầu:
- Không tự thêm feature ngoài mô tả.
- Viết ngắn, cụ thể, không mơ hồ.

Sản phẩm là một web app nhỏ giúp tôi quản lý toàn bộ hành trình xin việc, từ lúc tìm JD đến lúc có offer hoặc bị từ chối.

Người dùng chính là tôi (developer đang đi xin việc), nhưng sau này có thể mở rộng cho người khác dùng.

Các hành động chính tôi muốn làm trong MVP:

Thêm một job application mới với các thông tin: công ty, vị trí, link JD, kiểu job (full-time / internship / freelance), location, mức lương/mức lương kỳ vọng (optional), nguồn (LinkedIn, referral, website công ty, v.v.).

Cập nhật trạng thái pipeline của mỗi application: Applied, Screening, Interview (có thể nhiều vòng), Offer, Rejected, On Hold.

Ghi chú cho từng application: ghi lại ngày apply, lịch phỏng vấn, câu hỏi khó, feedback từ recruiter/hiring manager.

Xem một trang tổng quan (dashboard đơn giản) với các số liệu: tổng số ứng dụng đã tạo, số ứng dụng mỗi trạng thái (đang chờ phản hồi, đang phỏng vấn, bị từ chối, có offer), và số interview đã diễn ra.

Lọc và sắp xếp danh sách ứng dụng theo trạng thái, công ty, vị trí, nguồn, hoặc thời gian apply.

MVP phải có:

Giao diện web đơn giản, mobile-friendly ở mức cơ bản, chỉ cần một màn hình chính (list + form) và một trang tổng quan đơn giản.

Backend API tách riêng (giống Habit Check-in Tracker): có endpoint để list/create/update job applications, cập nhật trạng thái, thêm ghi chú, và lấy summary cho dashboard.

Database Postgres với schema rõ ràng cho job applications, companies (optional ở MVP nếu cần), notes, và trạng thái.

Deploy production: backend trên Railway, frontend trên Vercel, có health check, có CORS config đúng, và một URL duy nhất để tôi đặt trong CV cho nhà tuyển dụng nhấp vào.

Chưa làm ở phiên bản đầu (Out of scope cho MVP):

Không có user auth / login (chỉ mình dùng, chấp nhận rủi ro nếu người khác thấy được app).

Không có import/export dữ liệu phức tạp (CSV, Excel, v.v.), chỉ cần CRUD cơ bản.

Không có tích hợp với API bên ngoài (LinkedIn, Indeed, email, lịch).

Không có reminder/notification, email/sms, hay lịch phỏng vấn tự động.

Không có tính năng team/collaboration nhiều người dùng.

Không có analytics phức tạp (chart nhiều chiều, ML scoring, v.v.) ở MVP; chỉ cần vài số aggregate đơn giản.

Stack dự kiến:

Backend: Python + FastAPI, ORM (SQLAlchemy), PostgreSQL, Alembic migration, deploy trên Railway (giống Habit Check-in Tracker).

Frontend: React + Vite (TypeScript nếu hợp lý), deploy trên Vercel.

Infra: env file .env cho local, .env.example trong repo, deploy-checklist trong docs/deploy-checklist.md theo Template v3.
```