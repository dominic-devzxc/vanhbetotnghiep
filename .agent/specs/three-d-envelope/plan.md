# Kế hoạch kỹ thuật

## Quyết định

- Giữ Next.js, React, React Three Fiber và Framer Motion đang có; không thêm GSAP.
- Dùng shape/extrude và box/cylinder geometry của Three.js, với `useFrame` điều khiển timeline mở thư.
- Raycaster do React Three Fiber cung cấp qua handler đặt trực tiếp trên mesh con dấu.
- Trang trí nền tiếp tục là CSS/React để giảm tải WebGL; chuyển động chính của phong thư vẫn ở Three.js.

## Trình tự

1. Viết lại `EnvelopeScene` thành các mesh có tên và bản lề thật.
2. Đổi `InvitationCover` sang luồng: nhập tên → kích hoạt con dấu → click/Enter trên con dấu để mở.
3. Điều chỉnh điều phối trang mở để thời lượng animation do scene báo hoàn tất.
4. Docker build và kiểm tra responsive thủ công.

## Rủi ro và kiểm soát

- Thiết bị yếu: giới hạn DPR 2, số mesh trang trí thấp, không dùng texture ảnh lớn.
- Reduced motion: bỏ idle animation và rút ngắn sequence nhưng vẫn cho mở bằng bàn phím.
