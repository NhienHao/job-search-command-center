# MVP Scope — Job Search Command Center

## Mô tả sản phẩm

Web app nhỏ giúp quản lý toàn bộ hành trình xin việc: từ lúc tìm JD đến khi có offer hoặc bị từ chối. Một nơi lưu application, trạng thái pipeline, ghi chú phỏng vấn, và xem tổng quan nhanh.

## Người dùng mục tiêu

- **MVP:** Developer đang đi xin việc (single user, không auth).
- **Sau MVP:** Có thể mở rộng cho người dùng khác.

## Mục tiêu MVP

1. CRUD job application với thông tin cơ bản (công ty, vị trí, link JD, loại job, location, nguồn; lương/kỳ vọng lương optional).
2. Cập nhật trạng thái pipeline: Applied → Screening → Interview (nhiều vòng) → Offer / Rejected / On Hold.
3. Ghi chú theo application: ngày apply, lịch phỏng vấn, câu hỏi khó, feedback recruiter/hiring manager.
4. Dashboard đơn giản: tổng application, số theo trạng thái, số interview đã diễn ra.
5. Lọc và sắp xếp danh sách theo trạng thái, công ty, vị trí, nguồn, thời gian apply.
6. Giao diện web đơn giản, mobile-friendly cơ bản: màn hình chính (list + form) + trang tổng quan.
7. Backend API tách riêng; Postgres schema rõ ràng; deploy production (Railway + Vercel) với health check, CORS, một URL public để đặt trong CV.

## Out-of-scope (MVP)

- User auth / login.
- Import/export phức tạp (CSV, Excel).
- Tích hợp API bên ngoài (LinkedIn, Indeed, email, lịch).
- Reminder / notification (email, SMS, lịch tự động).
- Team / collaboration nhiều người dùng.
- Analytics phức tạp (chart nhiều chiều, ML scoring); chỉ aggregate số đơn giản.

## Tech stack dự kiến

| Layer | Stack |
|-------|-------|
| Backend | Python, FastAPI, SQLAlchemy, PostgreSQL, Alembic |
| Frontend | React, Vite, TypeScript (nếu hợp lý) |
| Deploy | Backend: Railway · Frontend: Vercel |
| Infra | `.env` local, `.env.example` trong repo, `docs/deploy-checklist.md` (Template v3) |
