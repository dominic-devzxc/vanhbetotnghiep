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

- [ ] T018 [US1] Dùng ảnh thiệp 3D do người dùng cung cấp làm texture của khối thiệp Three.js trong `components/envelope-scene.tsx`; kiểm thử Docker trước khi hoàn tất.
