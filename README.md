# 🎓 Thiệp Mời Tốt Nghiệp Cử Nhân - Vân Anh (vanhbetotnghiep)

Dự án landing page thiệp mời tốt nghiệp cử nhân của Vân Anh được xây dựng với phong cách thiết kế hiện đại, tinh tế, sử dụng tone màu Pastel nhẹ nhàng kết hợp với hiệu ứng hoạt họa mượt mà (smooth animations) mang lại trải nghiệm cảm xúc cá nhân hóa cho từng khách mời.

---

## 🎨 Hệ Màu Sắc Chủ Đạo (Pastel Theme)

Hệ màu sắc được chọn lựa kỹ lưỡng để tạo cảm giác nhẹ nhàng, ấm áp và trang nhã:

| Mã Màu | Minh Họa | Tên Gọi & Vai Trò | Ứng Dụng Thực Tế |
| :--- | :---: | :--- | :--- |
| **`#FBEFEF`** | <div style="background:#FBEFEF;width:30px;height:30px;border-radius:4px;border:1px solid #ddd;"></div> | **Soft Alabaster** | Màu nền chính của trang web (Background) tạo cảm giác dễ chịu. |
| **`#FFE2E2`** | <div style="background:#FFE2E2;width:30px;height:30px;border-radius:4px;border:1px solid #ddd;"></div> | **Pastel Peach** | Màu nền phụ, tạo chiều sâu cho các khối hoặc vùng chuyển tiếp. |
| **`#F5CBCB`** | <div style="background:#F5CBCB;width:30px;height:30px;border-radius:4px;border:1px solid #ddd;"></div> | **Blush Rose** | Màu nhấn cho khung viền bức thư, nút nhấn (CTA) hoặc tiêu đề phụ. |
| **`#C5B3D3`** | <div style="background:#C5B3D3;width:30px;height:30px;border-radius:4px;border:1px solid #ddd;"></div> | **Pastel Lavender** | Màu nhấn đặc biệt mang sắc tím mộng mơ, dùng cho các nút hoặc hiệu ứng chuyển trang. |

---

## 📜 Kịch Bản Trải Nghiệm Người Dùng (UX Flow)

### 🔹 Bước 1: Mở Đầu (The Envelope Front)
- **Giao diện:** Một bìa thư pastel thanh lịch xuất hiện ở trung tâm màn hình với dòng chữ:  
  *“Thân gửi [Tên Khách Mời]”* (Input tên khách mời được lấy tự động qua tham số URL `?to=...` hoặc cho phép người dùng tự nhập nếu chưa có).
- **Hoạt họa:** Bìa thư có hiệu ứng nhịp tim nhẹ (pulse) hoặc hiệu ứng lơ lửng (float) kích thích người dùng tương tác.
- **Hành động:** Khách mời nhấn nút **"Mở Thư"** (hoặc nhấn **Enter**).

### 🔹 Bước 2: Lật Mặt & Mở Thư 3 Phần (The Triple-Fold Letter)
- **Hoạt họa:** Bìa thư thực hiện động tác lật mặt sau 3D mượt mà (3D flip) và mở ra làm 3 phần xếp chồng hoặc dàn ngang tinh tế (Triple-fold fold-out).
- **Nội dung hiển thị:**
  - **Phần 1: Lời Mời Trân Trọng (Invitation)**  
    *“Thân mời [Tên Khách Mời] tới tham dự buổi lễ thân mật và chiêm ngưỡng khoảnh khắc Vân Anh nhận tấm bằng tốt nghiệp cử nhân.”*
  - **Phần 2: Thời Gian & Địa Điểm (When & Where)**  
    - **Thời gian:** 9h00 - 12h00 ngày 21/07/2026.
    - **Địa điểm:** Học viện Quản lý Giáo dục.
    - **Hình ảnh:** Ảnh Vân Anh giơ bằng cử nhân (ghép ảnh photoshop hài hước nhưng sắc nét, phóng to làm trung tâm điểm nhấn trực quan).
  - **Phần 3: Phản Hồi Từ Khách Mời (RSVP)**  
    *“Gấc mong [Tên Khách Mời] tham gia cùng Vân Anh nhé!”*
    - **Lựa chọn 1 (YES - Thật tuyệt):** Nhấn vào sẽ kích hoạt hiệu ứng pháo hoa giấy (confetti) pastel rơi đầy màn hình kèm dòng chữ ấm áp: *“Thật tuyệt, Vân Anh rất mong chờ được đón tiếp bạn!”*
    - **Lựa chọn 2 (NO - Tiếc quá):** Nhấn vào sẽ chuyển đổi nhẹ nhàng sang lời nhắn: *“Thặc đáng tiếc, mong rằng chúng ta sẽ có dịp gặp lại nhau sớm nhất có thể. Cảm ơn bạn rất nhiều!”*

---

## 🛠️ Công Nghệ & Thư Viện Đề Xuất (Tech Stack)

Để hệ thống hoạt động cực kỳ mượt mà trên nền tảng Web hiện đại:
- **Core Framework:** Next.js (App Router, React 19) tối ưu hóa tải trang và SEO tốt.
- **Styling:** Tailwind CSS cho việc quản lý style nhanh chóng, nhất quán với hệ màu định nghĩa sẵn trong cấu hình `tailwind.config.js`.
- **Animations (Làm hệ thống mượt mà):**
  - **Framer Motion:** Thư viện hoạt họa mạnh mẽ của React chuyên trị các chuyển động lật 3D (3D flip), cuộn mở thư (unfolding) và hiệu ứng xuất hiện (fade-in/stagger).
  - **Canvas Confetti:** Tạo hiệu ứng bắn pháo hoa giấy mượt mà khi khách mời nhấn "Yes".
- **Hạ tầng (Docker-First):** Chạy ứng dụng hoàn toàn trong container thông qua Docker & Docker Compose để tránh lỗi môi trường.

---

## 🐳 Hướng Dẫn Phát Triển Với Docker (Local Development)

Dự án tuân thủ nghiêm ngặt chính sách **Docker-First**.

### 1. Cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
PORT=8900
API_URL=http://localhost:8902
```

### 2. Khởi chạy dự án
Khởi động container ở chế độ nền (detached):
```powershell
docker compose up -d --build
```

### 3. Theo dõi Logs
Nếu gặp lỗi hoặc cần debug:
```powershell
docker compose logs -f web
```
