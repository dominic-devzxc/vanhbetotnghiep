# Debug: phong thư tối và thiệp mini vẫn lòi khi mở

Ngày: 2026-07-18

## Tái hiện

1. Nhập tên và bấm con dấu.
2. Trong sequence mở, mesh `invitationCard` trượt lên trong chính phong bì 3D.
3. Một phần thiệp/viền trắng xuất hiện cùng phong bì trước khi màn thiệp thật được hiển thị.

Kỳ vọng: phong bì và dấu sáp đều là pastel sáng; sequence chỉ gồm dấu tách và nắp mở, sau đó chuyển sang thiệp thật.

## Root cause

- Scene vẫn chứa một `invitationCard` riêng với texture, box và animation trượt. Dù thay đổi trục Z, phần vượt biên phong bì vẫn phải xuất hiện theo thiết kế, trái với trải nghiệm người dùng mong muốn.
- Các material giấy hiện dùng hồng xám trung tính và ba nguồn sáng có shadow tương phản cao, khiến pastel bị tối/xỉn.
- Nền dấu sáp dùng `#A64A62`, là berry đậm chứ không phải pastel.

## Fix plan

- Xóa toàn bộ mesh/texture/timeline của thiệp mini; giữ sequence dấu tách và nắp mở.
- Đổi material phong bì, dấu sáp và họa tiết sang pastel sáng.
- Tăng ánh sáng môi trường, giảm directional/spot shadow để màu giữ độ sáng.
