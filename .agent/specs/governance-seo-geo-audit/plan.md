---
title: Governance, SEO and GEO Audit Plan
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## Phase 0 — Research

- Nguồn sự thật: `README.md`, `.env` (chỉ các biến port/URL không nhạy cảm), `.agent/identity/master-identity.md`, `.agent/knowledge_base/infrastructure.md`, `.agent/knowledge_base/seo_standards.md` và toàn bộ danh sách tệp repository.
- Kết quả khảo sát: README chọn Next.js App Router/React 19, Tailwind CSS, Framer Motion và Canvas Confetti; `.env` phân bổ frontend `8900`, admin `8901`, API `8902`; repository chưa có manifest, source code, Dockerfile/Compose hoặc public assets.
- Điều chưa thể đo: Lighthouse/Core Web Vitals, HTTP status, rendered metadata và HTTPS vì chưa có ứng dụng để build/run.

## Phase 1 — Data Model

Không áp dụng: công việc chỉ cập nhật governance và audit, không tạo hoặc thay đổi thực thể dữ liệu.

## Phase 2 — API Contracts

Không áp dụng: không có API được tạo hoặc thay đổi trong phạm vi này.

## Phase 3 — Architecture

- Cập nhật `.agent/memory/constitution.md` làm nguồn luật duy nhất.
- Tạo `.agent/memory/seo-audit-report.md` và `.agent/memory/geo-audit-report.md` làm snapshot đánh giá repository ngày 2026-07-17.
- Không tạo cấu trúc ứng dụng, dependency hay Docker config khi chưa có yêu cầu triển khai.

## Phase 4 — Must-Haves (Goal-Backward)

- **Truths**: phân biệt stack mục tiêu với trạng thái đã triển khai; chỉ chấm đạt khi có bằng chứng; ports luôn được ánh xạ qua ENV.
- **Artifacts**: Constitution cập nhật, báo cáo SEO có điểm số, báo cáo GEO có kết luận gate.
- **Key Links**: cả hai báo cáo dẫn chiếu checklist SEO; GEO dẫn chiếu kết quả SEO vì workflow yêu cầu SEO ≥80 trước khi GEO đạt.

## Docker Topology

Topology mục tiêu gồm frontend, admin (dự phòng) và API; mapping host port lần lượt lấy từ `PORT_FE`/`NEXT_PUBLIC_PORT_FE`, `ADMIN_PORT`, `API_PORT`. Chưa có Compose nên không thực hiện build hoặc health check.

## Blast Radius

Thấp: chỉ thay đổi tài liệu dưới `.agent`; không tác động runtime, dữ liệu hay public API.

## Constitution Gate

- Docker-first: đạt, không chạy runtime trên host.
- ENV-first ports/secrets: đạt, không thêm URL/token/key hard-code vào mã ứng dụng.
- Quy tắc ≤3 tệp/tác vụ: đạt qua phân tách trong `tasks.md`.
- Build gate: không áp dụng vì repository chưa có Docker build definition; phải ghi nhận là blocker triển khai, không coi là build pass.
