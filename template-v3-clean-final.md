# Vibe Coding Project Template v3 — Cursor-first, iteration-ready

> Mục tiêu của template này:
> - Dùng Cursor để triển khai mini project theo workflow có kiểm soát.
> - AI làm phần lớn việc tạo/sửa code.
> - Bạn giữ quyền chốt scope, behavior, trade-off, và review.
> - Docs là source of truth cho mọi prompt tiếp theo.
> - Mỗi bước phải có prompt rõ, phạm vi sửa rõ, pass condition rõ, và commit point rõ.

---

## 0. Nguyên tắc vận hành

### Vai trò

- **Bạn**
  - quyết định vision, scope, và trade-off,
  - review diff,
  - chạy app / test,
  - xác nhận pass condition,
  - quyết định commit / deploy.

- **Cursor**
  - đọc docs/codebase hiện tại,
  - nêu plan ngắn nếu task không nhỏ,
  - chỉ sửa trong scope,
  - tóm tắt file đã sửa,
  - nêu phần bạn cần test.

### Rules nên có trong `.cursor/rules/project-rules.md` hoặc `docs/ai-rules.md`

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

### Format chuẩn cho mọi prompt

Mỗi prompt nên có 6 phần:

1. **Bước hiện tại**
2. **Context files phải đọc**
3. **Codebase hiện có**
4. **Task cần làm**
5. **Constraints / boundaries**
6. **Expected output**

Template ngắn:

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- [Tên bước]

Cursor hãy đọc trước:
- [file 1]
- [file 2]
- [file 3]

Codebase hiện có:
- [module/file/chức năng đã xong]

Tôi cần làm:
- [task rất cụ thể]

Yêu cầu:
1. Follow đúng pattern hiện tại của codebase.
2. Chỉ sửa các file cần thiết.
3. Không refactor lan sang phần khác nếu không cần.
4. Xử lý validation/error cơ bản nếu liên quan.
5. Nếu docs đang mâu thuẫn, dừng ở bước review docs và nêu rõ mâu thuẫn.
6. Sau khi làm xong, tóm tắt:
   - file đã tạo/sửa,
   - thay đổi chính,
   - cách tôi test.

Nếu task này cần sửa nhiều file hoặc có nhiều hướng làm, hãy đưa plan ngắn trước rồi mới code.
```

---

## 1. Scope docs

### Mục tiêu

Khóa scope dự án trước khi Cursor đụng vào code.

### Bạn làm

Viết ý thô:

- Sản phẩm là gì?
- Ai dùng?
- 3–5 hành động chính là gì?
- MVP phải có gì?
- Chưa làm gì ở phiên bản đầu?
- Stack dự kiến là gì?

### Output docs

- `docs/mvp-scope.md`
- `docs/user-stories.md`
- `docs/feature-list.md`

### Prompt cho Cursor

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

[PASTE Ý THÔ Ở ĐÂY]
```

### Bạn review gì

- Có đúng ý mình không?
- Out-of-scope có rõ không?
- Có đang “ham” feature không?

### Pass condition

- 3 file phản ánh đúng scope.
- Bạn mô tả lại dự án trong 3 câu được.

### Commit point

- Commit sau khi scope docs đã chốt.

---

## 2. Architecture / ERD / API overview

### Mục tiêu

Tạo technical context đủ dùng cho backend/frontend prompts.

### Output docs

- `docs/architecture.md`
- `docs/erd.md`
- `docs/api-overview.md`

### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 2 — Architecture + ERD + API overview

Cursor hãy đọc trước:
- docs/mvp-scope.md
- docs/user-stories.md
- docs/feature-list.md

Tôi cần:
1. docs/architecture.md
2. docs/erd.md
3. docs/api-overview.md

Yêu cầu:
- Thiết kế đủ cho MVP, không over-engineer.
- ERD phải rõ bảng/entity, field, PK/FK, nullable, unique.
- API overview phải có method, path, request body ngắn, response ngắn.
- Nếu phù hợp, thêm mermaid đơn giản trong architecture.md.
- Không viết kiểu “tính sau”.

Sau khi làm xong, tóm tắt:
- entity gốc là gì,
- API quan trọng nhất là gì,
- chỗ nào cần tôi review kỹ nhất.
```

### Bạn review gì

- ERD có đủ tối giản chưa?
- API có khớp user stories không?
- Có phần nào “dự phòng quá xa” không?
- Có behavior nào liên quan delete / migration / computed field cần ghi rõ ngay không?

### Pass condition

- Có thể nhìn docs để prompt bước sau mà không phải nghĩ lại từ đầu.

### Commit point

- Commit sau khi architecture, ERD, API overview đã chốt.

---

## 3. Environment / infra baseline

### Mục tiêu

Dựng nền móng local chạy được.

### 3.1 Project structure

#### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 3.1 — Environment + project structure

Cursor hãy đọc trước:
- docs/mvp-scope.md
- docs/architecture.md

Tôi đang dùng stack:
- [điền stack]

Hãy:
1. Đề xuất structure đủ rõ cho MVP.
2. Tạo các file/folder nền móng cần thiết.
3. Tạo health check tối thiểu.
4. Không thêm feature business logic ở bước này.

Yêu cầu:
- Ưu tiên đơn giản.
- Follow đúng stack đã chọn.
- Nếu cần chạy lệnh init, hãy liệt kê rõ tôi cần chạy lệnh nào.
- Sau khi xong, tóm tắt file đã tạo/sửa và cách chạy local.
```

### 3.2 Local DB / env setup

#### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 3.2 — Local DB / env setup

Cursor hãy đọc trước:
- docs/architecture.md
- docs/erd.md

Tôi cần:
- env mẫu,
- DB local setup,
- health check DB,
- cấu hình tối thiểu để app kết nối DB.

Yêu cầu:
- Không hardcode config trong code.
- Tạo .env.example nếu phù hợp.
- Nếu dùng Docker, tạo docker-compose tối thiểu.
- Sau khi xong, liệt kê chính xác tôi cần chạy lệnh nào.
```

### 3.3 Migration setup

#### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 3.3 — Migration setup

Cursor hãy đọc trước:
- docs/erd.md
- codebase backend hiện tại

Tôi cần:
- setup migration tool phù hợp,
- config DB,
- quy trình chuẩn generate/apply migration,
- không dùng create-all thủ công.

Yêu cầu:
- Giữ đơn giản cho MVP.
- Sau khi xong, ghi rõ:
  - lệnh tạo migration mới
  - lệnh apply migration
  - file config chính nằm ở đâu
```

### Pass condition

- App chạy local.
- DB kết nối được.
- Migration apply được.
- Có `.env.example` hoặc config mẫu rõ ràng.

### Fast-path note

Nếu đây là project mới nhưng cùng stack với project trước, có thể dùng fast-path:
- copy baseline infra,
- verify local run,
- không cần viết lại toàn bộ setup từ đầu.

### Commit point

- Commit sau khi app chạy local và migration dùng được.

---

## 4. First implementation loop

### Mục tiêu

Ship bản MVP đầu tiên theo flow nhỏ, không prompt “làm hết app”.

### 4.1 Model/schema đầu tiên

#### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 4.1 — First core model

Cursor hãy đọc trước:
- docs/erd.md
- docs/architecture.md
- codebase backend hiện tại

Tôi cần tạo model đầu tiên cho entity: [Tên entity]

Yêu cầu:
1. Tạo model/schema đúng theo ERD.
2. Tạo migration tương ứng.
3. Chỉ sửa các file cần thiết.
4. Không tạo thêm entity khác ở bước này.
5. Sau khi xong, tóm tắt:
   - file đã tạo/sửa,
   - field nào quan trọng,
   - lệnh tôi cần chạy để verify.
```

### 4.2 Các model còn lại

#### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 4.2 — Remaining models

Cursor hãy đọc trước:
- docs/erd.md
- model đầu tiên đã có
- migration setup hiện tại

Tôi cần tạo các models còn lại cho MVP.

Yêu cầu:
- Mỗi model ở file rõ ràng.
- FK / unique / nullable đúng ERD.
- Thêm relationship hợp lý nếu framework/ORM hỗ trợ.
- Tạo migration đầy đủ.
- Không tự thêm field ngoài ERD.
- Sau khi xong, tóm tắt quan hệ giữa các entity.
```

### 4.3 Core backend / business logic

#### Template prompt chuẩn cho mọi module backend

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 5.x — [Tên module]

Cursor hãy đọc trước:
- docs/api-overview.md
- docs/erd.md
- [các file backend liên quan đang có]

Codebase hiện có:
- [liệt kê model/schema/router/service đã có]

Tôi cần làm module:
- [ví dụ: Task CRUD / Auth / Upload]

Yêu cầu:
1. Tạo request/response schema phù hợp.
2. Tạo service/use-case layer theo pattern hiện tại.
3. Tạo router/controller/endpoints cho module này.
4. Handle validation/error cơ bản.
5. Chỉ sửa các file cần thiết.
6. Không đụng module khác nếu không cần.
7. Sau khi làm xong, tóm tắt:
   - file đã tạo/sửa,
   - endpoint đã thêm,
   - cách tôi test local.

Nếu có nhiều hướng làm, hãy nêu plan ngắn trước.
```

### 4.4 Frontend integration

#### 4.4.1 Frontend shell

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 6.1 — Frontend shell

Cursor hãy đọc trước:
- docs/api-overview.md
- docs/mvp-scope.md
- codebase frontend hiện tại (nếu đã có)

Backend hiện có:
- [URL local hoặc mô tả endpoint chính]

Tôi cần:
1. Setup frontend shell với stack [điền stack frontend].
2. Tạo route structure cơ bản.
3. Tạo API client / service layer.
4. Tạo env mẫu nếu phù hợp.
5. Chưa làm UI hoàn chỉnh ở bước này.

Yêu cầu:
- Ưu tiên đơn giản cho MVP.
- Chỉ tạo nền móng để gọi được 1 endpoint thật.
- Sau khi xong, tóm tắt:
  - file đã tạo/sửa,
  - lệnh chạy frontend,
  - cách tôi verify integration.
```

#### 4.4.2 Template prompt cho từng screen

```text
Tiếp tục project frontend hiện tại.

Bước hiện tại:
- Step 6.x — [Tên màn hình]

Cursor hãy đọc trước:
- docs/api-overview.md
- [các component/page/service liên quan]

Context:
- API liên quan: [liệt kê endpoint]
- Component/route hiện đã có: [liệt kê]
- Trạng thái cần xử lý: loading, empty, error, success

Tôi cần tạo màn hình:
- [Tên màn hình + flow chính]

Yêu cầu:
1. UI đơn giản, rõ ràng.
2. Tích hợp API thật.
3. Có loading / empty / error state.
4. Tách component nếu file quá dài.
5. Không phá structure hiện tại.
6. Sau khi xong, tóm tắt:
   - file đã tạo/sửa,
   - flow user hoàn thành thế nào,
   - tôi cần test gì trên UI.
```

### Pass condition

- Local flow chính chạy được.
- Case lỗi cơ bản pass.
- Không có drift lớn giữa docs và code.

### Commit point

- Commit sau mỗi pass condition nhỏ:
  - model/migration,
  - backend module,
  - frontend screen.

---

## 5. Baseline deploy

### Mục tiêu

Ship bản đầu tiên lên production theo cách đơn giản nhất.

### Output docs

- `docs/deploy-checklist.md`

### Nên có trong checklist

- Thứ tự deploy.
- Env vars.
- Build/start commands.
- CORS / production URL rules.
- Verify sau deploy.
- Lỗi thường gặp.

### Prompt cho Cursor

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step 7.3 — Deploy checklist

Cursor hãy đọc trước:
- docs/architecture.md
- docs/api-overview.md
- backend/.env.example
- frontend/.env.example
- codebase hiện tại

Stack hiện tại:
- Frontend: [điền]
- Backend: [điền]
- Database: [điền]
- Target deploy: [ví dụ Railway + Vercel]

Tôi cần:
1. Checklist deploy ngắn gọn cho project này.
2. Env vars cần có.
3. Build/start command.
4. CORS / production URL config nếu cần.
5. Các file cấu hình deploy cần tạo nếu cần.

Yêu cầu:
- Ưu tiên deploy đơn giản cho MVP.
- Không thêm infra phức tạp.
- Sau khi xong, tóm tắt:
  - tôi cần làm gì theo thứ tự,
  - command nào phải chạy trước,
  - cách verify sau deploy.
```

### Pass condition

- Có URL production chạy được hoặc ít nhất checklist deploy rất rõ.
- Verify flow chính pass trên production.

### Commit point

- Commit trước deploy.
- Commit lại sau khi deploy pass nếu có thay đổi config/docs cuối.

---

## 6. Self-review

### Mục tiêu

Đảm bảo bạn vẫn hiểu app sau khi AI code phần lớn.

### Output docs

- `docs/self-review-checklist.md`

### Prompt cho Cursor

```text
Dựa trên codebase hiện tại và các docs trong thư mục docs/,
hãy tạo file docs/self-review-checklist.md gồm các câu hỏi ngắn để tôi tự trả lời.

Tôi muốn tự kiểm tra xem mình đã hiểu:
- kiến trúc,
- database,
- flow API,
- frontend integration,
- deploy,
- nếu thêm 1 feature mới thì sửa đâu trước.

Yêu cầu:
- câu hỏi ngắn, rõ,
- không trả lời hộ,
- chia theo section.
```

### Pass condition

- Bạn trả lời được phần lớn mà không nhìn note quá nhiều.
- Bạn biết layer nào sửa trước khi thêm feature.

---

## 7. Post-MVP feature iteration

> Phần mới quan trọng nhất của v3.

### Khi nào dùng

Khi MVP đã ship và bạn muốn thêm một feature nhỏ tiếp theo:
- edit/delete,
- field mới,
- endpoint mới,
- màn hình mới,
- behavior mới.

### 7.1 Feature scope update

Trước khi code, update docs cho feature mới.

#### Có thể cần sửa

- `docs/mvp-scope.md`
- `docs/feature-list.md`
- `docs/user-stories.md`
- `docs/api-overview.md`
- `docs/architecture.md`
- `docs/erd.md` nếu đụng data shape/rules

#### Prompt mẫu

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step F1 — Update docs for new feature

Cursor hãy đọc trước:
- docs/mvp-scope.md
- docs/feature-list.md
- docs/user-stories.md
- docs/api-overview.md
- docs/architecture.md
- docs/erd.md

Context:
- MVP hiện tại đã ship.
- Tôi muốn thêm feature: [tên feature].

Tôi cần:
1. Cập nhật docs liên quan cho feature mới.
2. Chưa code backend/frontend ở bước này.
3. Nếu feature tạo ra mâu thuẫn giữa API / ERD / architecture, hãy nêu rõ trước.

Yêu cầu:
- Giữ scope nhỏ.
- Không lan sang feature khác.
- Sau khi xong, tóm tắt:
  - file docs đã sửa,
  - behavior mới là gì,
  - chỗ nào tôi cần review kỹ nhất.
```

### 7.2 Docs consistency gate

> Không code nếu docs còn lệch nhau.

#### Checklist bắt buộc

- API behavior có khớp ERD không?
- Delete behavior có khớp FK hiện tại không?
- Computed field có bị lỡ chuyển thành persisted field không?
- Có cần migration không?
- `architecture.md` có còn wording cũ không?

### Pass condition

- Docs sync.
- Đã chốt rõ:
  - có migration hay không,
  - delete/update behavior là gì,
  - backend sẽ xử lý ở layer nào.

### Commit point

- Commit sau khi docs cho feature mới đã sync.

---

## 8. Decision gate cho behavior nhạy cảm

> Dùng khi đụng:
> - delete,
> - cascade/restrict,
> - migration,
> - data retention,
> - auth/permission,
> - payment,
> - production security.

### Prompt mẫu

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step D1 — Behavior decision before code

Cursor hãy đọc trước:
- docs/api-overview.md
- docs/erd.md
- docs/architecture.md
- codebase liên quan

Tôi cần chốt behavior cho:
- [ví dụ: delete habit khi còn check_ins]

Hãy:
1. Tóm tắt hiện trạng schema/code.
2. Nêu 2–3 cách làm khả thi.
3. Với mỗi cách, nêu trade-off ngắn.
4. Đề xuất cách đơn giản nhất phù hợp scope hiện tại.
5. Chưa code ở bước này.

Yêu cầu:
- Nếu đụng schema/database, nói rõ có cần migration không.
- Nếu không đổi DB, nói rõ service/backend phải xử lý thế nào.
```

### Pass condition

- Bạn đã chốt behavior trước khi Cursor bắt đầu code.
- Không còn quyết định mơ hồ bị đẩy sang lúc implement.

### Commit point

- Không bắt buộc commit nếu chỉ là decision note, nhưng nên commit nếu docs đã thay đổi theo decision đó.

---

## 9. Feature implementation loop

### 9.1 Backend module

Dùng lại tinh thần step backend của bản MVP, nhưng luôn bắt đầu từ docs đã sync.

### 9.2 Frontend module

Dùng lại tinh thần step frontend của bản MVP, nhưng luôn kèm regression cases và flow cũ không được vỡ.

### 9.3 Commit point

Commit sau khi:
- backend pass local, hoặc
- frontend pass local.

### Pass condition

- Feature mới chạy local.
- Case lỗi cơ bản pass.
- Flow cũ không regress.

---

## 10. Regression checklist

> Sau mỗi feature nhỏ, test cả mới lẫn cũ.

### 10.1 New feature cases

- case thành công,
- validation lỗi,
- id sai / not found,
- cancel/undo nếu có.

### 10.2 Regression cases

- create cũ còn chạy,
- list cũ còn chạy,
- old toggle/check-in flow còn chạy,
- refresh persistence còn đúng,
- UI error state còn đúng.

### Prompt cleanup / polish

```text
Tiếp tục project hiện tại.

Bước hiện tại:
- Step R1 — Cleanup / polish after feature

Cursor hãy đọc trước:
- docs/mvp-scope.md
- docs/api-overview.md
- các file vừa sửa

Tôi muốn cleanup theo tiêu chí:
- bỏ dead code,
- rename cho rõ,
- giảm lặp logic,
- tách file nếu quá dài,
- không đổi behavior hiện tại.

Yêu cầu:
- Không refactor lan.
- Không đổi API contract.
- Sau khi xong, liệt kê:
  - file đã sửa,
  - cleanup chính,
  - chỗ tôi nên test lại.
```

### Pass condition

- Local test pass.
- Regression pass.
- Cleanup không đổi behavior.

### Commit point

- Commit sau cleanup nếu regression vẫn pass.

---

## 11. Redeploy checklist cho feature iteration

> Khác với baseline deploy, đây là checklist ngắn sau mỗi feature mới.

### Thứ tự

1. Commit.
2. Push.
3. Redeploy backend nếu backend đổi.
4. Verify health/API.
5. Redeploy frontend nếu frontend đổi.
6. Verify feature mới trên production.
7. Verify regression cases trên production.

### Verify tối thiểu

- feature mới pass,
- flow cũ pass,
- refresh persistence đúng,
- không lỗi CORS/network.

### Pass condition

- Feature mới ship production.
- Không phá production flow cũ.

---

## 12. Prompt library

Tạo `docs/prompts/` và giữ lại prompt tốt đã dùng thật.

### Tối thiểu nên có

- `requirements.md`
- `architecture.md`
- `backend-module.md`
- `frontend-screen.md`
- `feature-docs-update.md`
- `behavior-decision.md`
- `cleanup.md`
- `deploy-baseline.md`
- `redeploy-feature.md`
- `self-review.md`

---

## 13. Session workflow chuẩn

Mỗi session:

1. Xác định đang ở bước nào.
2. Chọn đúng docs/context files.
3. Gửi prompt ngắn, rõ, có boundary.
4. Xem Cursor plan.
5. Review diff.
6. Chạy/test.
7. Xác nhận pass condition.
8. Commit.
9. Nếu cần, cập nhật docs.
10. Nếu feature đã ship, update prompt library.

---

## 14. Khi nào phải review kỹ hơn bình thường

Các vùng nguy hiểm:

- auth,
- permission,
- payment,
- migration/data deletion,
- security config,
- production deploy config,
- logic liên quan tiền/quyền/dữ liệu nhạy cảm.

### Rule

- prompt nhỏ hơn,
- bắt buộc plan trước,
- có decision gate,
- review diff kỹ hơn,
- test kỹ hơn,
- commit nhỏ hơn.

---

## 15. Commit workflow

- Mỗi feature/loop lớn một branch nếu cần.
- Commit sau mỗi pass condition.
- Review diff trước khi accept.
- Nếu Cursor đi sai hướng, quay về commit gần nhất rồi prompt lại.

Ví dụ commit:

- `feat: add habits create/list backend`
- `feat: add today check-in frontend`
- `chore: add deploy checklist`
- `feat: add habit edit/delete backend`
- `feat: add habit edit/delete frontend`
- `chore: cleanup validation and pending flow`
