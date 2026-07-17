# Thiệp mời tốt nghiệp — Đào Vân Anh

Landing page thiệp mời tốt nghiệp mobile-first, phong cách pastel và hiệu ứng phong thư 3D. Khách nhập tên để mở thiệp, xem thông tin buổi lễ và gửi RSVP vào Google Sheet.

## Trải nghiệm

- Mở link có tên sẵn: `/?to=Lan`.
- Nhập hoặc chỉnh tên, nhấn Enter hoặc **Mở thư**.
- Phong thư lật mở 3D và bung thành hai phần thông tin.
- Chọn **Có, mình đi** hoặc **Hẹn dịp khác**.
- API server ghi tên, lựa chọn và thời gian gửi vào Google Sheet qua Apps Script.

## Palette

| Màu | Vai trò |
|---|---|
| `#FBEFEF` | Nền pastel chính |
| `#FFE2E2` | Lớp giấy và panel phụ |
| `#F5CBCB` | Viền và ánh sáng phụ |
| `#C5B3D3` | Dấu niêm phong và accent |

## Tech stack

- Next.js App Router, React 19 và TypeScript.
- Tailwind CSS 4 cho responsive design tokens.
- Motion cho biến đổi 3D có giảm chuyển động tự động.
- canvas-confetti chỉ dùng sau RSVP “Có”.
- Google Apps Script + Google Sheet cho RSVP.
- Docker Compose cho local build/run; Vercel cho Production.

## Local development

```powershell
docker compose up --build
```

Mở `http://localhost:8900`. Local dùng `RSVP_DRY_RUN=true` nên không ghi lượt test vào Sheet.

## Production

Xem hướng dẫn Apps Script, Vercel và domain tại [docs/deployment.md](docs/deployment.md).
