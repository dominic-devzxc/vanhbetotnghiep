# 🎓 Vân Anh Graduation Invitation

Landing page thiệp mời dự lễ tốt nghiệp của Vân Anh, được thiết kế như một phong thư pastel có thể tương tác. Trải nghiệm tập trung vào cảm giác ấm áp, tinh tế, mượt trên điện thoại và dễ chia sẻ qua đường dẫn cá nhân hóa.

> **Trạng thái:** Đã chốt định hướng thiết kế và tech stack. Source ứng dụng và Docker runtime chưa được khởi tạo.

## Mục tiêu sản phẩm

- Truyền tải đầy đủ lời mời, thời gian và địa điểm buổi lễ.
- Cá nhân hóa lời chào bằng tham số `?to=Tên khách mời`.
- Tạo khoảnh khắc mở thiệp đáng nhớ bằng chuyển động nhẹ và có chủ đích.
- Cho phép khách mời phản hồi tham dự nhanh trên mọi kích thước màn hình.
- Giữ trang nhẹ, dễ crawl, dễ bảo trì và không phụ thuộc backend khi chưa cần lưu RSVP.

## Định hướng hình ảnh

Phong cách chủ đạo là **pastel editorial**: nền sáng dịu, hình khối mềm, typography thanh lịch và khoảng trắng rộng. Giao diện tránh gradient, shadow dày hoặc animation liên tục; chiều sâu đến từ lớp giấy, viền mảnh và chuyển động mở thư.

### Bảng màu chủ đạo

| Màu | Tên gợi nhớ | Vai trò |
|---|---|---|
| `#FBEFEF` | Soft Alabaster | Nền trang chính, tạo không gian sáng và dịu mắt |
| `#FFE2E2` | Pastel Peach | Nền phụ, mặt trong phong thư và vùng chuyển tiếp |
| `#F5CBCB` | Blush Rose | Viền, nút chính, trạng thái tương tác và chi tiết nhấn |
| `#C5B3D3` | Pastel Lavender | Điểm nhấn tương phản, icon và hiệu ứng chúc mừng |

Nguyên tắc phối màu:

- Dùng `#FBEFEF` làm nền chiếm diện tích lớn nhất.
- Dùng `#FFE2E2` và `#F5CBCB` để phân lớp phong thư, không phủ kín toàn trang.
- Chỉ dùng `#C5B3D3` cho điểm nhấn quan trọng như CTA hoặc trạng thái RSVP.
- Màu chữ cần đủ tương phản; không dùng bốn màu pastel làm màu chữ chính trên nền sáng.

## Trải nghiệm người dùng

### 1. Phong thư chờ mở

- Hiển thị lời chào `Thân gửi [Tên khách mời]`.
- Nếu URL không có `to`, dùng lời chào chung thay vì yêu cầu nhập bắt buộc.
- Phong thư chuyển động rất nhẹ để gợi ý tương tác.
- Người dùng có thể mở bằng nút, phím Enter hoặc thao tác chạm.

### 2. Mở thiệp

- Phong thư lật và mở theo chuỗi chuyển động 3D ngắn.
- Nội dung xuất hiện theo thứ tự: lời mời → thời gian, địa điểm → RSVP.
- Animation không được trì hoãn việc đọc nội dung hoặc chặn thao tác.

### 3. Nội dung lời mời

- **Thời gian:** 09:00–12:00, ngày 21/07/2026.
- **Địa điểm:** Học viện Quản lý Giáo dục.
- **Điểm nhấn:** ảnh tốt nghiệp của Vân Anh, được tối ưu kích thước và định dạng hiện đại.

### 4. Phản hồi RSVP

- **Tham dự:** hiển thị lời cảm ơn và confetti pastel trong thời gian ngắn.
- **Không thể tham dự:** chuyển sang lời nhắn cảm ơn nhẹ nhàng.
- Bản đầu chỉ quản lý trạng thái trên giao diện. Chỉ bổ sung API/database khi có yêu cầu lưu và tổng hợp RSVP thực tế.

## Tech stack

### Công nghệ cốt lõi

| Công nghệ | Vai trò | Lý do chọn |
|---|---|---|
| **Next.js App Router** | Framework web, routing, metadata, SSR/SSG | Tải nhanh, SEO tốt và có sẵn các primitive cần thiết cho landing page |
| **React 19** | Xây dựng component và tương tác RSVP | Phù hợp stack Next.js đã chọn, đủ cho state cục bộ |
| **TypeScript** | Kiểm tra kiểu dữ liệu | Giảm lỗi ở query parameter, content model và component props |
| **Tailwind CSS** | Layout, responsive và design tokens | Giữ bảng màu, spacing và breakpoint nhất quán |
| **Docker + Docker Compose** | Môi trường build/run | Đảm bảo Docker-first và môi trường có thể tái lập |

### Chỉ dùng khi cần

| Công nghệ | Phạm vi sử dụng |
|---|---|
| **Motion for React (Framer Motion)** | Chuỗi mở phong thư, stagger và transition phức tạp; hiệu ứng đơn giản vẫn dùng CSS |
| **canvas-confetti** | Confetti ngắn khi khách xác nhận tham dự |

### Tính năng native ưu tiên

- `next/image` cho ảnh responsive, kích thước rõ ràng và WebP/AVIF.
- `next/font` để self-host font và hạn chế layout shift.
- Next.js Metadata API cho title, description, canonical và Open Graph.
- Route native cho `robots.txt`, `sitemap.xml` và `llms.txt`.
- React state cục bộ cho trạng thái mở thư và RSVP; chưa cần Redux/Zustand.
- CSS `perspective`, `transform` và `prefers-reduced-motion` cho hiệu ứng nhẹ.

## Cấu trúc ứng dụng dự kiến

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── robots.ts
└── sitemap.ts
components/
├── invitation-envelope.tsx
├── invitation-content.tsx
└── rsvp-actions.tsx
public/
├── images/
└── llms.txt
```

Cấu trúc này chỉ là baseline. Không tách thêm service, store hoặc abstraction khi chưa có nhu cầu thực tế.

## Tiêu chuẩn trải nghiệm

- Mobile-first từ màn hình nhỏ nhất; CTA có vùng chạm tối thiểu 44×44 px.
- Nội dung vẫn đọc và thao tác được khi JavaScript animation lỗi hoặc bị tắt.
- Tôn trọng `prefers-reduced-motion`; giảm hoặc bỏ flip, parallax và confetti.
- Chỉ preload ảnh hero thực sự là LCP; ảnh còn lại lazy-load và có kích thước cố định.
- Mục tiêu Core Web Vitals: LCP <2.5 giây, INP <200 ms, CLS <0.1.
- Chỉ một H1; thứ bậc heading tuần tự; nút có accessible name và focus state rõ ràng.

## SEO và GEO

- Title duy nhất ≤60 ký tự, meta description ≤160 ký tự và canonical lấy từ ENV.
- Nội dung lời mời quan trọng phải có trong HTML SSR/SSG, không phụ thuộc animation client-side.
- Cung cấp `robots.txt`, `sitemap.xml`, `llms.txt` và Open Graph image.
- Dùng JSON-LD đúng ngữ nghĩa của trang/sự kiện; không thêm schema Article hoặc Product nếu nội dung không phù hợp.
- Không đưa tên khách mời, URL cá nhân hóa hoặc dữ liệu RSVP vào sitemap, structured data hay `llms.txt`.

## Docker và cấu hình

Dự án bắt buộc build, test và run trong container. Frontend dùng host port mặc định `8900` thông qua biến `PORT_FE`; URL public và endpoint tương lai phải lấy từ ENV, không ghi cứng trong source.

Khi khởi tạo ứng dụng, repository cần có tối thiểu:

- `Dockerfile` multi-stage.
- `docker-compose.yml` cho local.
- `docker-compose.prod.yml` hardened, chạy non-root.
- `.env.example` chỉ chứa giá trị mẫu, không chứa secret.

## Nguyên tắc triển khai

1. Dùng CSS/Tailwind trước, chỉ dùng Motion cho chuyển động nhiều bước.
2. Không thêm backend hoặc database cho đến khi RSVP cần được lưu thật.
3. Không hy sinh khả năng đọc, accessibility hoặc tốc độ để đổi lấy hiệu ứng.
4. Mọi thay đổi phải qua Specify → Plan → Tasks → Implement và Docker build gate.
