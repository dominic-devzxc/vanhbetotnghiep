# 🔍 Báo cáo Technical SEO

Ngày audit: 2026-07-17
Phạm vi: toàn bộ repository `vanhbetotnghiep`
Chuẩn đối chiếu: `.agent/knowledge_base/seo_standards.md` và `speckit.seo`

## Kết luận

**Điểm: 0/100 — Không đạt**
**Gate:** 0 Critical yêu cầu / SEO ≥80 — **không đạt**
**Pre-condition workflow:** “Public pages implemented” — **chưa đạt**

Repository mới có README, cấu hình `.agent` và `.env`; không có source ứng dụng, package manifest, Dockerfile/Compose, `public/` hoặc build output. Vì vậy chưa có trang công khai nào để crawl, render hoặc đo Core Web Vitals. Các tiêu chí bên dưới được chấm theo bằng chứng thực tế, không coi tài liệu mô tả là triển khai.

## Cách chấm điểm

| Nhóm | Trọng số | Điểm đạt |
|---|---:|---:|
| Metadata, headings và URL | 30 | 0 |
| Crawlability và indexation | 25 | 0 |
| Structured data | 15 | 0 |
| Media và mobile-first | 10 | 0 |
| Core Web Vitals và performance budget | 20 | 0 |
| **Tổng** | **100** | **0** |

Tiêu chí “không thể xác minh” nhận 0 điểm cho tới khi có source hoặc rendered output. Đây là baseline readiness, không phải kết quả Lighthouse của một website đang chạy.

## 🔴 Critical

1. **Không có ứng dụng/public page để audit.** Không tồn tại manifest, source page/layout, Dockerfile hoặc Compose. Khắc phục: triển khai landing page bằng stack đã duyệt và cung cấp Docker build/run definition.
2. **Không có title và meta description có thể render.** Không thể xác minh title duy nhất ≤60 ký tự hoặc description ≤160 ký tự. Khắc phục: khai báo metadata trang và kiểm tra HTML render.
3. **Không có canonical URL.** Khắc phục: cấu hình canonical từ base URL qua ENV, không hard-code domain trong source.
4. **Không có `robots.txt`.** Khắc phục: tạo robots route/file, cho phép crawl CSS/JS và chặn đúng khu vực không công khai.
5. **Không có `sitemap.xml`.** Khắc phục: tạo sitemap tự động, xử lý build-time API failure an toàn và chỉ submit Search Console sau khi có domain Production.
6. **Không có structured data JSON-LD.** Khắc phục: landing page sự kiện tối thiểu cần schema phù hợp với nội dung thực tế; chỉ thêm Article/Product/FAQ khi trang thật sự thuộc loại đó.
7. **Không có cấu trúc heading có thể kiểm chứng.** Khắc phục: một H1 mô tả lời mời, sau đó H2/H3 theo thứ bậc; kiểm tra rendered DOM.
8. **Không có Docker build/runtime để xác thực HTTP 200 hoặc indexability.** Khắc phục: thêm Compose ENV-first, healthcheck và chạy audit trong container.

## 🟡 Warning

1. **Core Web Vitals chưa đo được:** LCP <2.5s, INP <200ms, CLS <0.1 đều chưa có dữ liệu. Khắc phục: đo Lighthouse/lab trong Docker sau build và xác minh bằng field data khi Production có traffic.
2. **Performance budget chưa đo được:** tổng trang <1.5 MB, JS <300 KB, CSS <100 KB, font <100 KB chưa có bundle/output.
3. **Ảnh chưa audit được:** không có asset để xác minh alt mô tả, WebP/AVIF, lazy loading và width/height hoặc `aspect-ratio`.
4. **Mobile-first chưa audit được:** không có CSS/layout hoặc viewport output.
5. **URL slug chưa audit được:** không có route; route tương lai phải lowercase, dùng dấu gạch nối và không dấu.
6. **Font loading chưa audit được:** chưa có font để kiểm tra `font-display: swap`.
7. **Internal links chưa audit được:** chưa có navigation hoặc content page.
8. **Custom 404 chưa có:** không có route/not-found page hoặc rendered response để xác minh.

## 🟢 Info

1. README đã mô tả Next.js App Router và mục tiêu Docker-first, nhưng đây chỉ là stack mục tiêu, chưa phải bằng chứng triển khai.
2. `.env` đã dành các cổng frontend `8900`, admin `8901`, API `8902`; repository vẫn thiếu `.env.example`, nên onboarding/build tái lập chưa đạt Constitution.

## Đối chiếu checklist bắt buộc

| Tiêu chí | Trạng thái | Bằng chứng |
|---|---|---|
| Title duy nhất ≤60 ký tự | ❌ | Không có public page |
| Meta description ≤160 ký tự | ❌ | Không có public page |
| Một H1 và H1→H2→H3 | ❌ | Không có rendered DOM |
| Canonical cho mỗi page | ❌ | Không có metadata/route |
| Sitemap tự động | ❌ | Không có sitemap/build |
| Robots không chặn CSS/JS | ❌ | Không có robots |
| Alt, lazy load, WebP/AVIF | ❌ | Không có image asset/component |
| Slug lowercase, hyphen, không dấu | ❌ | Không có route |
| Mobile-first | ❌ | Không có UI/CSS |
| LCP <2.5s | ⚪ Chưa đo | Không có runtime |
| INP <200ms | ⚪ Chưa đo | Không có runtime |
| CLS <0.1 | ⚪ Chưa đo | Không có runtime |
| Page/bundle/font budget | ⚪ Chưa đo | Không có build output |
| JSON-LD phù hợp | ❌ | Không có source/public page |

## Thứ tự khắc phục

1. Khởi tạo ứng dụng và Docker definitions theo Constitution; thêm `.env.example` không chứa secret.
2. Triển khai landing page SSR/SSG với metadata, canonical, một H1 và image optimization.
3. Thêm robots, sitemap, not-found và JSON-LD phù hợp nội dung.
4. Build/run hoàn toàn trong Docker, kiểm tra HTTP 200 và rendered HTML.
5. Chạy Lighthouse/performance budget, sửa Critical/Warning rồi re-audit đến khi ≥80.

Không tự động sửa các mục trên trong lần audit này vì đó là một feature implementation/khởi tạo kiến trúc mới, vượt ngoài yêu cầu kiểm tra và cần spec riêng.
