# Implementation plan — Phong thư Three.js

Người dùng đã phê duyệt trực tiếp thiết kế và luồng mở thư chi tiết trong yêu cầu ngày 17-07-2026. Thay đổi kiến trúc giới hạn ở scene Three.js, vỏ form và điều phối stage; không thay đổi API RSVP hay dữ liệu Google Sheets.

Các task được chia trong `tasks.md`; mỗi lần chỉnh sửa chỉ tác động tối đa ba tệp nguồn, sau đó phải qua Docker build gate trước khi commit.
