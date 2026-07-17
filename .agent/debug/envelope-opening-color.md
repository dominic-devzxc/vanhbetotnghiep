# Debug: màu phong thư sai và thiệp lộ ở đáy khi mở

Ngày: 2026-07-17

## Triệu chứng và cách tái hiện

1. Nhập tên, bấm con dấu để mở phong thư.
2. Ở giữa sequence, nắp và lòng phong thư chuyển sang nâu/xám đục thay vì pastel hồng.
3. Mép dưới của thiệp trắng xuất hiện xuyên qua mặt trước trước khi thiệp trượt khỏi miệng phong thư.

Kỳ vọng: màu hồng phấn giữ ổn định ở trạng thái đóng/mở; thiệp chỉ hiện từ miệng phong thư rồi mới tiến ra mặt trước.

## Bằng chứng và root cause

- `createPaperTexture` tô toàn texture bằng `#E2C3C1`, sau đó texture này tiếp tục bị nhân với màu hồng của từng `meshStandardMaterial`. Hai lớp màu tạo kết quả tối và ngả nâu dưới shadow.
- `CanvasTexture` chưa khai báo `SRGBColorSpace`, nên dữ liệu màu do Canvas tạo không được diễn giải như màu giao diện sRGB.
- `invitationCard` nội suy trục Z ngay từ đầu `easedCard`; nó vượt mặt thân thư trong khi phần lớn chiều cao thiệp vẫn còn nằm trong bao thư, gây lộ mép dưới như ảnh repro.

## Fix plan

- Đổi paper texture thành nền giấy trung tính gần trắng, giữ sắc hồng ở material và khai báo sRGB cho cả hai CanvasTexture.
- Làm sáng palette các lớp giấy để không biến thành nâu khi nhận shadow.
- Giữ thiệp sau mặt phong thư trong toàn bộ hành trình; phần trượt vượt khỏi miệng thư sẽ tự hiện đúng qua depth buffer.
