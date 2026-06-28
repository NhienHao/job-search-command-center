# AI Rules — Project Rules for Cursor

Dùng file này làm rule chung cho mọi session Cursor trong project.

## Core rules

- Không đổi scope nếu tôi chưa yêu cầu.
- Chỉ sửa file liên quan trực tiếp tới task.
- Không refactor lan sang module khác nếu không cần.
- Nếu task ảnh hưởng hơn 3 file, hãy nêu plan ngắn trước khi sửa.
- Nếu có nhiều lựa chọn kỹ thuật, ưu tiên cách đơn giản nhất cho MVP hoặc feature iteration hiện tại.
- Không đổi schema/database nếu tôi chưa yêu cầu rõ.
- Nếu docs hiện tại mâu thuẫn nhau, hãy dừng ở bước review docs; chưa code ngay.
- Khi xong, luôn liệt kê:
  - file đã tạo/sửa,
  - thay đổi chính,
  - việc tôi cần test.

## Behavior when docs conflict

Nếu thấy mâu thuẫn giữa:

- `docs/api-overview.md`
- `docs/erd.md`
- `docs/architecture.md`
- `docs/mvp-scope.md`

thì:

1. Không code ngay.
2. Chỉ ra chính xác file nào đang lệch nhau.
3. Tóm tắt 1–2 cách xử lý.
4. Đề xuất cách đơn giản nhất phù hợp scope hiện tại.
5. Chờ tôi chốt rồi mới tiếp tục code.

## Sensitive changes

Các thay đổi sau phải thận trọng hơn bình thường:

- migration,
- data deletion,
- FK / unique / nullable,
- auth / permission,
- payment,
- security config,
- production deploy config.

Với các case này:

- nêu plan trước,
- giải thích trade-off ngắn,
- không tự chọn hướng phá schema nếu tôi chưa chốt.

## Output format after each task

Sau mỗi task, luôn tóm tắt theo format:

- File đã tạo / sửa
- Thay đổi chính
- Việc tôi cần test
- Rủi ro / chỗ cần review kỹ (nếu có)

## Coding style expectations

- Follow pattern hiện có của codebase.
- Ưu tiên code đơn giản, rõ ràng, dễ review.
- Không thêm abstraction nếu chưa thật sự cần.
- Không thêm feature ngoài prompt.
- Không đổi API contract hiện có nếu tôi chưa yêu cầu.
- Không đổi behavior hiện có trong cleanup/refactor.

## Commit mindset

Mục tiêu là làm việc theo pass condition nhỏ.
Sau mỗi pass condition:

- dừng,
- tóm tắt,
- để tôi review/test trước khi sang bước tiếp theo.