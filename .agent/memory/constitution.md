# 📜 Hiến pháp Dự án

## §0 Giao thức bro-skills (BẮT BUỘC)
- **BẮT BUỘC**: Mọi hoạt động phát triển (Code), kiểm thử (Test) và triển khai (Deploy Production) bắt buộc phải sử dụng tiện ích `bro-skills`.
- **Quy trình**: Tuân thủ nghiêm ngặt quy trình SDLC: Đặc tả (Specify) → Kế hoạch (Plan) → Tác vụ (Tasks) → Thực thi (Implement).
- **Công cụ**: Chỉ sử dụng các workflow trong thư mục `.agent/workflows` để thực hiện công việc.

## §1 Hạ tầng & Môi trường (DOCKER-FIRST)
- **Chính sách Docker-First**: Sử dụng Docker theo mặc định cho cả môi trường Local và Production. TUYỆT ĐỐI KHÔNG chạy trực tiếp `npm`/`node`/`python` trên máy host.
- **Local**: Sử dụng `docker-compose.yml` để phát triển.
- **Production**: Sử dụng `docker-compose.prod.yml` với cấu hình bảo mật được tăng cường.
- **Cổng kết nối**: Cấu hình cổng linh hoạt thông qua biến môi trường (.env) để tránh xung đột.

## §2 An toàn Production & Bảo mật
- **NGHIÊM CẤM**: Chạy lệnh `docker compose down -v` trên môi trường Production.
- **NGHIÊM CẤM**: Triển khai thủ công (bắt buộc phải sử dụng các workflow `/deploy-production` hoặc `/deploy-staging`).
- **Xác nhận**: Yêu cầu xác nhận rõ ràng từ người dùng trước khi thực hiện Dọn dẹp sâu (Deep Clean), Triển khai Prod (Deploy Prod), hoặc Xóa dữ liệu (Delete Data).
- **Tài khoản chạy**: Các container trong môi trường Production KHÔNG ĐƯỢC chạy dưới quyền root.

## §3 Tiêu chuẩn Code & ENV (Biến môi trường)
- **NGHIÊM CẤM viết cứng (hard-code)**: Các đường dẫn URLs, Tokens, Keys, Credentials, Endpoints, và các văn bản mặc định.
- **Biến nhạy cảm**: bắt buộc phải sử dụng biến môi trường (ENV) (tệp `.env` ở local, ENV server ở prod).
  - Tiền tố bắt buộc: `NEXT_PUBLIC_*`, `API_*`, `DB_*`.
- **Xác thực cấu hình**: 
  - Biến quan trọng (Critical): `throw new Error()` nếu thiếu.
  - Biến tùy chọn (Optional): `console.error()` nếu thiếu.
- **Tài liệu**: Phải có tệp `.env.example` đầy đủ.

## §4 Quy trình & Viết Script
- **Tự động hóa**: Chủ động tạo các script khi gặp lỗi lặp lại hoặc các công việc lặp đi lặp lại.
- **Git**: Lưu trữ các script trong thư mục `.agent/scripts` và commit vào hệ thống kiểm soát phiên bản.
- **Tự động Commit**: BẮT BUỘC thực hiện git commit & push ngay sau khi hoàn thành bất kỳ tính năng hoặc tác vụ nào theo chuẩn Conventional Commits.
- **Cập nhật**: Cập nhật lại các workflow tương ứng sau khi tạo script mới.

## §5 UI/UX & Chống cẩu thả (PREMIUM DESIGN)
- **BẮT BUỘC**: Sử dụng năng lực `design-taste-frontend` hoặc workflow `/util-speckit.uiux` để thiết kế giao diện.
- **NGHIÊM CẤM**: Sử dụng các mẫu thiết kế giao diện có sẵn nhàm chán, màu sắc mặc định của trình duyệt, hoặc lạm dụng các dải màu gradient/shadow do AI tự sinh.
- **Hệ thống thiết kế**: bắt buộc phải tuân thủ các nguyên tắc chống cẩu thả (Bố cục bất đối xứng, lưới bento, Ưu tiên kiểu chữ, Vi tương tác).
