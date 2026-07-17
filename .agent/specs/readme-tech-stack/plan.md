---
title: README Landing Page và Tech Stack Plan
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## Phase 0 — Research

- Nguồn sự thật: yêu cầu người dùng, README hiện tại và Constitution 2.0.0.
- Repository chưa có manifest hoặc source; README chỉ mô tả định hướng được duyệt.
- Không cần nghiên cứu dependency mới: stack đã được Constitution chốt.

## Phase 1 — Data Model

Không áp dụng; thay đổi chỉ là tài liệu.

## Phase 2 — API Contracts

Không áp dụng; RSVP được mô tả ở mức UI local, chưa yêu cầu lưu trữ.

## Phase 3 — Architecture

- Viết lại `README.md` với các phần: tổng quan, định hướng hình ảnh, bảng màu, UX flow, tech stack, cấu trúc dự kiến, hiệu năng/SEO/accessibility và Docker-first.
- Không tạo source, dependency hoặc Docker definition trong task tài liệu này.

## Phase 4 — Must-Haves

- **Truths**: bốn mã màu chính xác; Next.js và Tailwind CSS là core; animation tôn trọng reduced motion.
- **Artifacts**: `README.md` và bộ artifact SDLC.
- **Key Links**: tech stack phải phù hợp `.agent/memory/constitution.md`.

## Docker Topology

Tài liệu giữ frontend ở host port mặc định `8900` qua `PORT_FE`; chưa tạo topology runtime.

## Blast Radius và Constitution Gate

- Rủi ro thấp, chỉ thay đổi tài liệu.
- Mỗi task ảnh hưởng tối đa 3 tệp.
- Không chạy Node/Python trên host; không có build gate vì chưa có Dockerfile/Compose hoặc source ứng dụng.
