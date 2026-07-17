# 🤖 Báo cáo GEO (Generative Engine Optimization)

Ngày audit: 2026-07-17
Phạm vi: toàn bộ repository `vanhbetotnghiep`
Chuẩn đối chiếu: `.agent/knowledge_base/seo_standards.md` và `speckit.geo`

## Kết luận

**GEO readiness: 0/100 — Chưa sẵn sàng**
**SEO prerequisite:** 0/100, yêu cầu ≥80 — **bị chặn**

Workflow GEO chỉ được coi là đạt sau khi Technical SEO đạt ≥80. Theo yêu cầu, audit GEO vẫn được thực hiện như một gap analysis; không có mục nào được coi là triển khai chỉ vì đã xuất hiện trong README hoặc tài liệu agent.

## 1. AI Crawlability

| Tiêu chí | Trạng thái | Bằng chứng và khắc phục |
|---|---|---|
| `llms.txt` tại root domain | ❌ | Repository không có `public/llms.txt` hoặc public route. Tạo sau khi chốt URL Production và cấu trúc nội dung. |
| Nội dung dùng SSR/SSG, không CSR-only | ❌ | Không có framework/source/build để xác minh. Landing content phải có trong HTML response đầu tiên. |
| JSON-LD Article/Product/FAQ | ❌ | Không có public page/JSON-LD. Chỉ dùng schema khớp loại nội dung; không gắn Product/Article giả cho thiệp mời. |
| Robots/sitemap cho AI discovery | ❌ | Cả hai chưa tồn tại; xử lý ở Technical SEO trước. |

## 2. E-E-A-T

| Tín hiệu | Trạng thái | Khoảng trống |
|---|---|---|
| Experience | ⚪ Chưa chứng minh | README mô tả lễ tốt nghiệp cụ thể, nhưng chưa có nội dung public hoặc bằng chứng trải nghiệm trên trang. |
| Expertise | ❌ | Không có author/host bio hoặc thông tin định danh công khai có thể crawl. |
| Authoritativeness | ❌ | Không có nguồn dẫn, liên kết chính thức tới học viện hoặc dữ kiện được dẫn nguồn. |
| Trustworthiness | ❌ | Chưa có HTTPS endpoint, contact info, privacy notice hoặc chính sách xử lý dữ liệu RSVP/query parameter. |
| Publish/update dates | ❌ | Không có metadata/content page chứa ngày xuất bản/cập nhật. |

## 3. Định dạng nội dung cho AI

| Tiêu chí | Trạng thái | Khoảng trống |
|---|---|---|
| Câu trả lời trực tiếp đầu mỗi section | ❌ | Chưa có page content. |
| Đoạn ngắn 2–3 câu | ❌ | Chưa có page content. |
| Bullet/numbered lists | ❌ | README có danh sách nhưng không phải nội dung public. |
| Mỗi segment có ≥1 dữ kiện/citation | ❌ | Có thời gian/địa điểm trong README nhưng chưa có citation hoặc public rendering. |
| FAQ kiểu People Also Ask | ❌ | Chưa có FAQ; với thiệp mời nên ưu tiên câu hỏi thực dụng như thời gian, địa điểm, dress code, RSVP. |

## 4. Topic Authority

| Tiêu chí | Trạng thái | Nhận xét |
|---|---|---|
| Pillar + supporting content | ❌ | Chưa có content architecture. Với landing page sự kiện đơn, topic cluster có thể không đáng triển khai nếu không có chiến lược nội dung dài hạn. |
| Internal linking cùng chủ đề | ❌ | Không có route/content page. |

## Critical gaps

1. Technical SEO gate chưa đạt và chưa có website crawlable.
2. Thiếu `llms.txt`, SSR/SSG output và JSON-LD đúng ngữ nghĩa.
3. Thiếu tín hiệu tin cậy công khai: HTTPS, contact/privacy và nguồn xác minh thông tin sự kiện.
4. Thiếu nội dung có cấu trúc để AI trích dẫn.

## Kế hoạch tối thiểu để đạt GEO

1. Hoàn tất các bước khắc phục Technical SEO và re-audit đạt ≥80, không còn Critical.
2. Render thông tin cốt lõi của lời mời bằng SSR/SSG; personalization bằng `?to=` không được làm mất nội dung chính khỏi HTML ban đầu.
3. Thêm `llms.txt` mô tả ngắn website và liên kết tới trang canonical; không đưa dữ liệu cá nhân hoặc URL khách mời riêng tư vào tệp.
4. Thêm JSON-LD đúng loại trang và các dữ kiện xác minh được: tên sự kiện, thời gian, địa điểm, organizer; tránh schema không phù hợp chỉ để tăng coverage.
5. Thêm contact/privacy tối thiểu cho dữ liệu RSVP, nguồn chính thức của địa điểm và ngày cập nhật nội dung.
6. Chỉ xây topic cluster/FAQ mở rộng nếu website thực sự có mục tiêu tìm kiếm công khai; với thiệp mời đơn trang, YAGNI tốt hơn nội dung SEO giả tạo.

## Điều kiện re-audit

- Có Docker build/run thành công và public page trả HTTP 200.
- SEO report đạt ≥80 và 0 Critical.
- Có rendered HTML để kiểm tra SSR/SSG, JSON-LD, canonical và nội dung.
- Có `llms.txt`, robots và sitemap truy cập được tại root domain.
