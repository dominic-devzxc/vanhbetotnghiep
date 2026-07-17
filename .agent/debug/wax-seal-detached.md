# Debug: Con dấu nhìn tách khỏi phong bì 3D

## Hiện tượng

- Mong đợi: con dấu sáp là một phần của nắp phong bì và chuyển động cùng nắp khi mở.
- Thực tế: con dấu nhìn như một lớp nổi độc lập phía trên phong bì.
- Tái hiện: mở trang, nhập tên, quan sát con dấu rồi chạm để mở thư.

## Bằng chứng và nguyên nhân

- `components/EnvelopeScene.tsx` đã dựng con dấu bằng cylinder, torus, hạt và cánh hoa bên trong mesh nắp thư.
- `components/InvitationCover.tsx` đồng thời dựng thêm một button HTML hữu hình bằng `clip-path`, nền rose và icon `Flower2` phía trên Canvas.
- Button HTML không nằm trong scene graph Three.js nên không thể kế thừa rotation của nắp thư. Đây là lớp người dùng nhìn thấy và là nguyên nhân con dấu có cảm giác bị tách rời.

## Phương án sửa

- Giữ nguyên con dấu Three.js làm hình ảnh duy nhất.
- Button HTML chỉ còn hit-area trong suốt 96 px để bảo đảm thao tác cảm ứng và bàn phím.
- Xác nhận bằng ảnh trước/sau mở thư trên viewport mobile.
