# Debug: con dấu nhấp nháy và thiệp xuyên mặt phong thư

Ngày: 2026-07-17

## Triệu chứng và cách tái hiện

1. Mở màn intro, nhập tên để kích hoạt con dấu.
2. Quan sát vùng giữa phong thư: con dấu/phần sáng thay đổi liên tục, tạo cảm giác nhấp nháy.
3. Bấm con dấu: trong sequence mở, thiệp bên trong lộ qua mặt phong thư trước khi nắp và nếp gấp cho phép.

Kỳ vọng: dấu sáp đứng yên, chỉ đổi màu khi được kích hoạt; thiệp nằm sau các nếp gấp khi đóng và chỉ tiến ra trước sau khi nắp đã mở.

## Bằng chứng

- `EnvelopeScene.tsx:191-198`: `GlowRing` thay đổi scale và opacity mỗi frame.
- `EnvelopeScene.tsx:214-220`: tám `Sparkle` thay đổi opacity mỗi frame.
- `EnvelopeScene.tsx:295`: toàn bộ `waxSeal` tiếp tục thay đổi scale mỗi frame khi `armed`.
- `EnvelopeScene.tsx:296,340-345`: tâm thiệp ở `z=0.08`, cộng nửa độ dày `0.0375` và lớp mặt `0.049`, nên bề mặt thiệp đạt khoảng `z=0.1665`.
- `EnvelopeScene.tsx:349-359`: các nếp gấp phía trước nằm khoảng `z=0.098..0.175`; hai nhóm bề mặt giao nhau nên depth buffer không thể cho thứ tự che ổn định.

## Root cause

1. Nhấp nháy là hiệu ứng được tạo chủ động bởi ba animation lồng nhau (scale dấu, opacity glow và opacity sparkle), không phải lỗi trình duyệt.
2. Thiệp xuyên lớp vì mặt thiệp và các nếp gấp dùng các khoảng chiều sâu giao nhau trong trạng thái đóng; đây là lỗi bố trí trục Z, không phải CSS `z-index`.

## Fix plan

- Bỏ glow/sparkle và pulse liên tục; giữ một phản hồi tĩnh bằng màu sáp khi `armed`.
- Đặt thiệp đóng sâu hơn trong thân phong thư; chỉ đưa thiệp tiến ra trước theo `cardProgress` sau khi nắp đã mở.
- Giữ nguyên callback, timeline tổng và phạm vi một tệp `components/EnvelopeScene.tsx`.
