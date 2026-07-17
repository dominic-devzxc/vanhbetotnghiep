# UI Specs — Thiệp mời mobile-first

## Design parameters

- `DESIGN_VARIANCE`: 8/10 — phong thư editorial khác landing page card thông thường.
- `MOTION_INTENSITY`: 6/10 — phong thư Three.js 3D có chuyển động tiết chế, không gây chóng mặt.
- `VISUAL_DENSITY`: 5/10 — thoáng ở intro, giàu thông tin nhưng có nhịp trong thiệp.

## Visual language

- Background chính `#FBEFEF`, giấy thư `#FFF9F8`, lớp phụ `#FFE2E2`.
- Accent chính `#C5B3D3`; `#F5CBCB` chỉ dùng cho viền/ánh sáng phụ.
- Text chính `#3D3045`, text phụ `#6F5D73`, CTA đậm `#5B4868` với chữ sáng để đạt WCAG AA.
- Font: Geist Sans từ `next/font`; không trộn serif trong headline.
- “Lung linh” bằng các điểm sáng nhỏ, blur orb và sheen chạy chậm; không gradient cầu vồng, glow tím/xanh hoặc shadow dày.

## Mobile layout — bắt buộc

- Breakpoint thiết kế chính: 320, 390, 430 px; padding ngang 16–20 px.
- Intro chiếm tối thiểu `100dvh`, phong thư rộng `min(100%, 390px)`.
- Input cao ≥48 px, label luôn hiển thị, nút Mở thư cao ≥48 px.
- Thiệp sau mở là một column; lời mời, chi tiết sự kiện và RSVP xếp dọc, không chừa khung ảnh giả.
- Không có horizontal overflow ở 320 px; text không nhỏ hơn 14 px; body dùng 16–18 px.
- Desktop ≥768 px mới chuyển phần ảnh + nội dung thành split layout; mobile không thu nhỏ desktop.

## Components và states

### Intro envelope

- Phong thư dùng giấy lavender–mauve pastel sáng, các nếp gấp phân lớp bằng sắc độ cùng họ và viền champagne.
- Dấu sáp rose-gold pastel, mép hữu cơ tiết chế, có vòng, chuỗi hạt, nguyệt quế và biểu tượng mũ tốt nghiệp dập nổi; đường kính tối đa 20% chiều cao phong thư.
- Khi được kích hoạt, dấu có vòng sáng champagne và điểm sao tĩnh xung quanh; không pulse hoặc nhấp nháy opacity.
- Không đặt label hoặc CTA đè lên mặt dấu; hướng dẫn thao tác nằm ngoài Canvas.
- Submit bằng nút hoặc Enter.
- Invalid name: thông báo ngay dưới input, `aria-describedby`, không toast.

### Invitation

- Canvas Three.js dựng phong thư 3D ở intro; Motion dùng rotateY nhẹ khi chuyển sang nội dung.
- H1 tối đa hai dòng, sau đó lời mời cá nhân hóa.
- Event details dùng semantic `time` và address, icon code-native đơn giản.
- Phiên bản đầu không có ảnh; typography và khối thông tin phải tự tạo được điểm nhấn thị giác.

### RSVP

- Câu hỏi: “Bạn có thể đến chung vui không?”
- Hai nút có intent khác nhau: `Có, mình đi` (primary) và `Hẹn dịp khác` (secondary).
- Trong lúc gửi: cả hai disabled, nút đã chọn hiển thị “Đang gửi…”.
- Success Yes: cảm ơn và confetti ngắn; Success No: lời hẹn gặp lại, không confetti.
- Error: inline alert và nút vẫn cho phép gửi lại.

## Motion và accessibility

- Chỉ animate `transform` và `opacity`.
- `prefers-reduced-motion` tắt Canvas Three.js, sheen, sparkle drift, confetti và giảm duration gần 0.
- Focus ring tương phản, thứ tự tab: input → Mở thư → Có → Không.
- Nội dung chính vẫn có trong DOM/SSR; decoration dùng `aria-hidden`.
