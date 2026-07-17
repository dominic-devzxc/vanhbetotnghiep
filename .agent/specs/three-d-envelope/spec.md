# Đặc tả: Phong thư tốt nghiệp Three.js

## Mục tiêu

Trang mở đầu hiển thị một phong thư 3D pastel có thể thao tác thật, sau đó chuyển mượt sang thiệp mời hiện có mà không tải lại trang.

## Luồng người dùng

1. Người dùng thấy nền pastel, trang trí hoa nhẹ, ô nhập tên và phong thư 3D.
2. Nhấn Enter chỉ xác nhận tên và làm con dấu sáp sáng lên.
3. Nhấn đúng con dấu sáp để mở thư. Nếu tên trống, ô nhập rung và thông báo hướng dẫn xuất hiện.
4. Con dấu tách ra, nắp mở qua bản lề, thiệp bên trong trượt lên rồi màn hình sáng nhẹ trước khi sang thiệp mời.

## Yêu cầu chức năng

- Cảnh Three.js có các phần độc lập: `envelopeGroup`, `envelopeBody`, `leftFold`, `rightFold`, `bottomFold`, `flapPivot`, `topFlap`, `waxSeal`, `invitationCard`.
- Phong thư tím `#C5B3D3`, có chiều dày, chất liệu giấy nhám, viền champagne, bóng đổ và camera nhìn chếch từ trên.
- Con dấu là hình trụ màu hồng ánh kim, có cành hoa nổi; chỉ con dấu nhận thao tác mở thư.
- Mỗi cảnh dùng dpr tối đa 2, không tạo geometry/material mới trong render loop và hỗ trợ reduced motion.
- Desktop: khung thư chiếm khoảng 58% chiều rộng; mobile: 90%, không bị cắt.
- Form có label, thông báo aria-live, Enter để kích hoạt và thao tác bàn phím trên con dấu.

## Tiêu chí nghiệm thu

- Không có ảnh phong thư đóng làm texture hay PlaneGeometry duy nhất thay thế phong thư.
- Click ngoài con dấu không mở thư.
- Khi chưa có tên, con dấu không có trạng thái pointer và click báo “Bạn hãy nhập tên trước nhé!”.
- Khi mở, nắp xoay gần 175 độ quanh đường gấp trên; thiệp trượt lên rõ ràng.
- Docker build thành công trước commit/push.
