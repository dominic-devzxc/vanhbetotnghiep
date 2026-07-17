# 📜 Hiến pháp Dự án vanhbetotnghiep

Phiên bản: 2.0.0
Cập nhật: 2026-07-17

## §0 Giao thức bro-skills (BẮT BUỘC)

- Mọi thay đổi code, kiểm thử và triển khai phải đi theo thứ tự Specify → Plan → Tasks → Implement bằng workflow trong `.agent/workflows/`.
- Mỗi task phải hoàn thành trong tối đa 15 phút, ảnh hưởng tối đa 3 tệp và chỉ được đánh dấu hoàn tất sau khi gate tương ứng đạt.
- Thay đổi lớn vượt quá 3 tệp phải được chia thành task nguyên tử; nếu làm thay đổi kiến trúc, phải có `implementation_plan.md` và được người dùng chấp thuận trước.

## §1 Hạ tầng, Tech Stack & Ports (DOCKER-FIRST)

- Stack mục tiêu của web public là Next.js App Router, React 19, Tailwind CSS, Framer Motion và Canvas Confetti; trước khi dùng, mỗi thành phần phải xuất hiện trong manifest/lockfile và có Docker build thành công. Khi chưa có manifest, stack được xem là **đã chọn nhưng chưa triển khai**.
- Mọi hoạt động build, test và run của ứng dụng phải diễn ra trong container; nghiêm cấm chạy trực tiếp `node`, `npm`, `npx`, `python` hoặc package manager ứng dụng trên host.
- Local phải dùng `docker-compose.yml`. Self-hosted Production phải dùng `docker-compose.prod.yml`; riêng web public `vanhbetotnghiep` được phép deploy Production bằng Vercel theo yêu cầu chủ dự án, nhưng Docker vẫn là build/test gate bắt buộc trước khi push. Beta/Staging chỉ được tạo khi có yêu cầu.
- Host ports phải lấy từ ENV, với phân bổ mặc định: frontend `PORT_FE`/`NEXT_PUBLIC_PORT_FE` = `8900`, admin `ADMIN_PORT` = `8901`, API `API_PORT` = `8902`. Compose không được ghi trực tiếp các host port này nếu bỏ qua biến ENV.
- URL phía client/server phải lấy từ `NEXT_PUBLIC_API_URL`, `VITE_API_URL` hoặc `API_URL`; không được ghép cứng host, protocol hay port trong source code.

## §2 Bảo mật

- Container Production phải chạy bằng user không phải root; kiểm tra `docker inspect` không được trả về user rỗng hoặc `root` cho process ứng dụng.
- Production image phải dùng multi-stage build và chỉ chứa artifact/runtime dependency cần thiết; dev dependency và source không cần cho runtime không được nằm trong final stage.
- URL, token, key, credential và endpoint nhạy cảm không được ghi cứng hoặc commit; local dùng `.env`, Production dùng ENV của nền tảng và repository phải có `.env.example` chỉ chứa giá trị mẫu.
- Cấm chạy `docker compose down -v` trên Production; deep clean, deploy Production và xóa dữ liệu luôn cần xác nhận rõ ràng của người dùng.
- Production chỉ được triển khai qua workflow `/deploy-production` hoặc Git-connected Vercel từ production branch đã duyệt; Vercel CLI deploy thủ công cần xác nhận rõ ràng của người dùng.

## §3 Tiêu chuẩn Code & ENV

- Source ứng dụng phải dùng TypeScript khi stack Next.js được khởi tạo; `tsc`/framework type-check phải không có lỗi trước khi task code được hoàn tất.
- React component dùng PascalCase, function/variable dùng camelCase, biến môi trường dùng UPPER_SNAKE_CASE và public browser variables chỉ dùng tiền tố framework cho phép (`NEXT_PUBLIC_*` hoặc `VITE_*`).
- Biến cấu hình bắt buộc phải làm ứng dụng dừng với lỗi rõ ràng khi thiếu; biến tùy chọn phải ghi cảnh báo/lỗi quan sát được và có fallback an toàn.
- Public page phải có title, description và canonical riêng; content page phải có JSON-LD phù hợp và heading hierarchy chỉ có một H1.

## §4 Các điều không thể thương lượng

- Không hard-code URL, token, key, credential, endpoint hoặc host port trong source/Compose.
- Không chạy ứng dụng hoặc toolchain Node/Python trực tiếp trên host.
- Không commit code khi Docker build, test bắt buộc hoặc type-check đang lỗi.
- Không tự ý thay đổi kiến trúc, xóa dữ liệu hoặc deploy Production.
- Không đánh dấu SEO/GEO đạt nếu không có bằng chứng từ source, rendered output hoặc phép đo tương ứng.

## §5 Quy tắc Repository

- Repository hiện là single web project; không áp dụng monorepo contract cho đến khi có từ hai app/package độc lập trở lên.
- Nếu chuyển thành monorepo, shared package type exports phải là nguồn sự thật, mỗi app phải build độc lập và package exports phải khớp cấu trúc file thực tế.
- Thay đổi không liên quan và tệp do người dùng tạo phải được giữ nguyên; agent không được reset hoặc ghi đè để làm sạch worktree.

## §6 Quy tắc Docker & Vercel Deployment

- Production/Beta nghiêm cấm bind mount toàn repository như `.:/app`; runtime chỉ dùng image artifact và volume dữ liệu được chỉ định rõ.
- Mọi đường dẫn `COPY` trong Dockerfile phải tồn tại trong build context; Docker build phải thất bại nếu artifact bắt buộc bị thiếu.
- `CMD`/entrypoint phải trỏ đúng artifact build thực tế và container phải thoát lỗi thay vì chạy trạng thái giả khi entrypoint thiếu.
- Next.js app phải có thư mục `public/`, kể cả khi trống, trước Docker build.
- Host port mapping phải dùng các biến tại §1 và service nội bộ phải giao tiếp bằng service name/container port, không qua `localhost` của host.
- Vercel phải dùng framework detection native cho Next.js; domain và server-only integration URLs phải cấu hình trong Project Environment Variables, không commit vào source.
- Production branch của Vercel phải là `main`; custom domain chỉ được coi là hoàn tất sau khi Vercel báo DNS/SSL hợp lệ và public page trả HTTP 200.

## §7 An toàn Build-time cho Next.js

- Các đường build-time như sitemap, metadata, `generateStaticParams` và SSG phải xử lý lỗi API có chủ đích; lỗi upstream không được làm lộ secret hoặc tạo output sai mà không báo lỗi.
- API helper dùng trong build phải trả về `null`/collection rỗng theo contract an toàn khi `API_URL` không được cấu hình, hoặc dừng build nếu dữ liệu là bắt buộc.
- `sitemap.xml`, `robots.txt`, metadata và JSON-LD phải được kiểm tra từ output build/rendered, không chỉ từ sự tồn tại của source file.

## §8 Checklist trước Deploy

- `docker compose build` của đúng environment phải thành công và không dùng cache để che artifact thiếu khi xác thực release.
- Tất cả service bắt buộc phải ở trạng thái `Up`/healthy, không được `Restarting` hoặc `unhealthy`.
- Health endpoint và public landing page phải trả HTTP 200 từ trong topology Docker; redirect dự kiến phải được kiểm tra riêng.
- SEO gate phải đạt tối thiểu 80/100 và không còn Critical; GEO gate phải có `llms.txt`, JSON-LD phù hợp và tín hiệu E-E-A-T có thể xác minh.
- Chỉ commit/push sau khi diff đã được rà soát, không chứa `.env`, secret hoặc artifact build.
