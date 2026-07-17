# Kế hoạch kỹ thuật

## Phase 0 — Research

- Cảnh hiện tại đã có đủ mesh và timeline mở thư; không cần đổi kiến trúc hay thêm thư viện.
- Nguyên nhân sai hình nằm ở con dấu ghép từ bảy sphere lớn và nhãn HTML đặt đè lên Canvas.
- Three.js `Shape` + `extrudeGeometry` hiện có đủ khả năng tạo mép sáp hữu cơ và họa tiết dập nổi.

## Phase 1 — Data model

Không có dữ liệu bền vững mới. Giữ nguyên state `name`, `armed`, `opening` và các callback hiện tại.

## Phase 2 — API contracts

Không có API mới. Giữ nguyên interface `EnvelopeSceneProps` và `InvitationCoverProps`.

## Phase 3 — Architecture

```text
InvitationCover
├── form nhập tên
├── hướng dẫn mở thư
└── EnvelopeScene
    └── EnvelopeModel
        ├── thân và các nếp gấp giấy
        ├── nắp mở theo flapPivot
        └── waxSeal: đĩa sáp hữu cơ + vòng dập + mũ tốt nghiệp dập nổi
```

- Sửa trực tiếp `components/EnvelopeScene.tsx` để thay geometry và palette.
- Canvas texture dùng nền giấy trung tính và `SRGBColorSpace`; material là nguồn màu chính để tránh nhân màu hai lần.
- Loại bỏ thiệp mini khỏi scene; animation mở chỉ tách dấu và xoay nắp rồi báo hoàn tất.
- Sửa `components/InvitationCover.tsx` để đồng bộ fallback tĩnh, skeleton và loại bỏ nhãn che con dấu.
- Dùng một PNG khung hoa trong suốt làm decoration nền; phần UI, input và phong bì vẫn là code/Canvas tương tác thật.
- Không thay đổi state management hoặc callback; `app/page.tsx` chỉ thêm lớp decoration nền không tương tác.
- Docker topology giữ nguyên service `web`; mọi type-check/build chạy trong container.

## Phase 4 — Must-haves

- **Truths**: Chỉ dấu sáp mở thư; không có tên thì không mở; callback hoàn tất chỉ chạy một lần.
- **Artifacts**: `EnvelopeScene.tsx`, `InvitationCover.tsx` và tài liệu feature này.
- **Key links**: `InvitationCover.requestOpen` → `EnvelopeScene.onSealClick`; `EnvelopeScene.onOpenComplete` → callback chuyển màn.

## Constitutional gate

- Phạm vi code gồm 2 tệp, không đổi kiến trúc, không thêm dependency và không hard-code URL/secret.
- Mỗi task ảnh hưởng tối đa 2 tệp và có thể hoàn thành trong 15 phút.
- Build gate dùng Docker Compose theo hiến pháp.
