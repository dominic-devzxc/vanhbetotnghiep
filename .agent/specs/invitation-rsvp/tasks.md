---
title: Thiệp mời tốt nghiệp và RSVP Tasks
status: IN_PROGRESS
version: 1.0.0
created: 2026-07-17
---

## Phase 1: Setup

- [X] T001 [P] [US1] Tạo đặc tả, nghiên cứu và data model trong `.agent/specs/invitation-rsvp/spec.md`, `research.md`, `data-model.md`.
- [X] T002 [P] [US2] Tạo API contract, technical plan và UI specs trong `.agent/specs/invitation-rsvp/contracts/rsvp.md`, `plan.md`, `ui-specs.md`.
- [X] T003 [P] [US4] Tạo task plan, implementation plan và cập nhật Vercel exception trong `.agent/specs/invitation-rsvp/tasks.md`, `implementation_plan.md`, `.agent/memory/constitution.md`.

## Phase 2: Foundation

- [X] T004 [P] [US1] Khởi tạo dependency và TypeScript trong `package.json`, `package-lock.json`, `tsconfig.json`.
- [X] T005 [P] [US1] Cấu hình Next.js tooling trong `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`.
- [X] T006 [P] [US2] Cấu hình app shell và design tokens trong `next.config.ts`, `app/layout.tsx`, `app/globals.css`.

## Phase 3: Invitation flow

- [X] T007 [P] [US1] Triển khai copy, server page và trải nghiệm mở thư trong `content/invitation.ts`, `app/page.tsx`, `components/invitation-experience.tsx`.
- [X] T008 [P] [US2] Loại bỏ ảnh minh họa khỏi phiên bản đầu theo yêu cầu người dùng; giữ bố cục không phụ thuộc asset trong `content/invitation.ts`, `app/layout.tsx`, `app/globals.css`.

## Phase 4: RSVP và Google Sheet

- [X] T009 [P] [US3] Triển khai Next.js RSVP route, Apps Script và ENV mẫu trong `app/api/rsvp/route.ts`, `google-apps-script/Code.gs`, `.env.example`.
- [X] T010 [P] [US4] Cấu hình local Apps Script endpoint và ignore rules trong `.env`, `.gitignore`.

## Phase 5: SEO, GEO và deployment

- [X] T011 [P] [US2] Thêm crawlability assets trong `app/robots.ts`, `app/sitemap.ts`, `public/llms.txt`.
- [X] T012 [P] [US2] Thêm Docker local/prod trong `Dockerfile`, `docker-compose.yml`, `docker-compose.prod.yml`.
- [X] T013 [P] [US4] Thêm Docker security và hạ tầng docs trong `.dockerignore`, `.agent/knowledge_base/infrastructure.md`.
- [X] T014 [P] [US4] Viết hướng dẫn Apps Script/Vercel/domain và cập nhật project README trong `docs/deployment.md`, `README.md`.

## Final Phase: Polish

- [X] T015 [P] [US3] Tạo lockfile, chạy lint/build trong Docker và sửa lỗi trong tối đa 3 tệp mỗi lượt.
- [X] T016 [P] [US1] Kiểm thử intro/open/Yes/No, layout mobile 390/430 px và contract 320 px bằng browser, đối chiếu `.agent/specs/invitation-rsvp/spec.md`.
- [X] T017 [P] [US4] Cập nhật task/spec hoàn tất, rà Git diff và chuẩn bị commit trong `.agent/specs/invitation-rsvp/tasks.md`, `spec.md`.

## Phase 6: User-provided artwork

- [X] T018 [US1] Dùng ảnh thiệp 3D do người dùng cung cấp làm texture của phong thư Three.js trong `components/EnvelopeScene.tsx`, có loading UI và fallback giảm chuyển động.
- [X] T019 [US1] Triển khai hiệu ứng mở thư từ form nhập tên tới thiệp mời trong `components/InvitationCover.tsx`, `app/page.tsx`.
- [X] T020 [US3] Thiết kế thiệp mời dọc, chọn tham dự/không tham dự, lời cảm ơn và ô đôi lời gửi Vân Anh trong `components/InvitationCard.tsx`.
- [X] T021 [US3] Gửi lời nhắn tùy chọn cùng RSVP qua `app/api/rsvp/route.ts`, `google-apps-script/Code.gs`.

## Phase 7: Opening transition

- [X] T022 [US1] Thêm chuỗi chuyển cảnh phong thư mở, ánh sáng phủ màn hình rồi hiển thị thiệp trong `app/page.tsx`; kiểm thử Docker và mobile trước khi hoàn tất.

## Phase 8: Reference-matched envelope

- [X] T023 [US1] Thiết kế lại intro theo ảnh mẫu với tiêu đề, input dạng pill, phong bì tím nằm ngang, nắp tam giác và dấu sáp mở bằng Three.js trong `app/page.tsx`, `components/InvitationCover.tsx`, `components/EnvelopeScene.tsx`.

## Phase 9: Motion polish

- [X] T024 [US1] Giảm số lượng, kích thước và độ đậm của hoa anh đào rơi trong `app/page.tsx`; loading dùng mật độ thấp hơn nền chính.

## Phase 10: Wax seal interaction

- [X] T025 [US1] Dùng con dấu sáp hoa văn làm nút mở thư, bổ sung chi tiết nổi cho con dấu Three.js và phóng phong bì gần sát chiều rộng mobile trong `components/InvitationCover.tsx`, `components/EnvelopeScene.tsx`.
- [X] T026 [US1] Loại bỏ con dấu HTML hữu hình bị tách lớp, giữ hit-area trong suốt để con dấu Three.js là hình ảnh duy nhất trong `components/InvitationCover.tsx`; ghi nguyên nhân tại `.agent/debug/wax-seal-detached.md`.

## Phase 11: Typography polish

- [X] T027 [US1] Thay font trang trí bằng Dancing Script hỗ trợ tiếng Việt và dùng thống nhất cho `font-serif`, `font-handwriting` trong `app/layout.tsx`, `tailwind.config.js`.

## Phase 12: Vercel dependency repair

- [X] T028 [US1] Đồng bộ `package.json`, `package-lock.json` về Next 14/React 18/R3F 8, xác nhận npm install sạch và Docker build trước khi push `main`; ghi RCA tại `.agent/debug/vercel-npm-eresolve.md`.

## Phase 13: Input responsive fix

- [X] T029 [US1] Đặt ô nhập tên rộng 100% trong pill container tại `components/InvitationCover.tsx`; xác nhận bằng Docker build.

## Phase 14: Personalized artwork

- [X] T030 [US2] Hiển thị tên khách trên dòng trống trong ảnh thiệp và bỏ lớp chữ “Trân trọng kính mời” trùng lặp tại `components/InvitationCard.tsx`.
- [X] T031 [US3] Tái hiện local RSVP 502 và bổ sung bằng chứng Apps Script yêu cầu đăng nhập tại `.agent/debug/rsvp-502-apps-script-auth.md`.

## Phase 15: Apps Script sheet binding

- [X] T032 [US3] Mở Sheet qua `SPREADSHEET_ID` Script Property thay vì active spreadsheet trong `google-apps-script/Code.gs`; xác nhận build Docker.

## Phase 16: Flower motion scale

- [X] T033 [US1] Tăng kích thước cánh hoa rơi, giữ nguyên mật độ hiệu ứng tại `app/page.tsx`; xác nhận bằng Docker build.

## Phase 17: Click feedback

- [X] T034 [US1] Thêm vòng sáng pastel phản hồi tại vị trí chạm/click, tôn trọng reduced motion, trong `app/page.tsx`; xác nhận bằng Docker build.
