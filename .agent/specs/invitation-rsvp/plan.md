---
title: Thiệp mời tốt nghiệp và RSVP Plan
status: APPROVED
version: 1.0.0
created: 2026-07-17
---

## Phase 0 — Research

Kết quả và dependency baseline nằm trong `research.md`. Không còn mục NEEDS CLARIFICATION ngăn triển khai; ảnh thật được thay bằng asset minh họa đã ghi nhãn.

## Phase 1 — Data Model

`data-model.md` định nghĩa `RsvpSubmission` và ba cột Sheet. Không có database nội bộ.

## Phase 2 — API Contract

`contracts/rsvp.md` định nghĩa browser → Next.js API → Apps Script. Server validate, thêm timestamp và timeout sau 8 giây.

## Phase 3 — Architecture

```text
app/
├── api/rsvp/route.ts
├── globals.css
├── layout.tsx
├── page.tsx
├── robots.ts
└── sitemap.ts
components/
├── envelope-scene.tsx
└── invitation-experience.tsx
content/
└── invitation.ts
google-apps-script/
└── Code.gs
public/
└── llms.txt
```

- `page.tsx` là Server Component, đọc query `to`, sanitize và truyền tên mặc định xuống client.
- `invitation-experience.tsx` giữ state giao diện nhỏ và gọi `/api/rsvp`.
- `content/invitation.ts` là nguồn sự thật cho copy, thời gian và địa điểm.
- `route.ts` giữ Apps Script URL ở server-only ENV.
- Vercel deploy Next.js zero-config từ GitHub; Docker vẫn là build/test gate local và self-host fallback.

## State management

- `stage`: `cover`, `opening` hoặc `invitation`; loading chỉ kết thúc khi thời gian tối thiểu và scene 3D đều sẵn sàng.
- `attendance`: `yes`, `no` hoặc `null`.
- `status`: `idle`, `submitting`, `success`, `error`.
- Không dùng global store vì chỉ có một flow trên một page.

## Docker topology

- Local: service `web`, bind source cho hot reload, host `${PORT_FE:-8900}` → container `3000`.
- Production Docker fallback: standalone Next.js image, non-root, healthcheck HTTP.
- Vercel: native Next.js build, Production branch `main`, `NEXT_PUBLIC_SITE_URL` và `GOOGLE_APPS_SCRIPT_URL` cấu hình trong Project Environment Variables.

## Phase 4 — Must-Haves

- **Truths**: mobile-first; Three.js chỉ là enhancement có fallback; chỉ gửi tên, attendance, timestamp; endpoint server-only.
- **Artifacts**: app chạy được không phụ thuộc ảnh, Apps Script mẫu, Docker definitions, deployment guide, SEO/GEO routes.
- **Key Links**: RSVP buttons → `/api/rsvp` → Apps Script → Sheet; metadata/sitemap → `NEXT_PUBLIC_SITE_URL`.

## Constitution Gate

- Cần cập nhật Constitution để cho phép Vercel là Production platform được người dùng chỉ định; Docker vẫn bắt buộc cho local build/test.
- Ports giữ ENV-first và không ghi đè `.env` hiện có.
- Mỗi task tối đa 3 tệp và 15 phút.
- Không có secret trong source hoặc `.env.example`.
