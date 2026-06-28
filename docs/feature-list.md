# Feature List

Phân loại theo MVP. Không thêm feature ngoài mô tả gốc.

---

## Must-have

### Applications
- Tạo job application: công ty, vị trí, link JD, loại job (full-time / internship / freelance), location, nguồn (LinkedIn, referral, website công ty, …).
- Trường lương / lương kỳ vọng (optional).
- Xem danh sách applications.
- Sửa application.
- Cập nhật trạng thái pipeline: Applied, Screening, Interview, Offer, Rejected, On Hold (Interview hỗ trợ nhiều vòng qua ghi chú/trạng thái).

### Notes
- Thêm ghi chú cho từng application: ngày apply, lịch phỏng vấn, câu hỏi khó, feedback recruiter/hiring manager.

### List UX
- Lọc theo trạng thái, công ty, vị trí, nguồn.
- Sắp xếp theo thời gian apply (và các tiêu chí liên quan trong danh sách).

### Dashboard
- Tổng số applications.
- Số applications theo trạng thái (chờ phản hồi, đang phỏng vấn, bị từ chối, có offer).
- Số interview đã diễn ra.

### Frontend
- Màn hình chính: danh sách + form.
- Trang tổng quan đơn giản.
- Giao diện mobile-friendly cơ bản.

### Backend & data
- REST API: list / create / update applications, cập nhật trạng thái, thêm ghi chú, lấy summary dashboard.
- PostgreSQL: schema cho applications, notes, trạng thái.
- Health check endpoint.
- CORS cấu hình đúng cho frontend production.

### Deploy
- Backend trên Railway, frontend trên Vercel.
- Một URL public (frontend) dùng được trên CV.
- `.env.example` trong repo.

---

## Nice-to-have

- Bảng `companies` tách riêng thay vì lưu tên công ty trực tiếp trên application (optional ở MVP).
- TypeScript trên frontend nếu setup không tốn thêm effort đáng kể.

---

## Out-of-scope

- User auth / login.
- Import / export dữ liệu (CSV, Excel, …).
- Tích hợp API bên ngoài (LinkedIn, Indeed, email, calendar).
- Reminder, notification, email/SMS, lịch phỏng vấn tự động.
- Team / collaboration / multi-user.
- Analytics phức tạp (multi-dimensional charts, ML scoring, …).
