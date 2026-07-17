# Data Model — RSVP

## RsvpSubmission

| Field | Kiểu | Bắt buộc | Quy tắc |
|---|---|---:|---|
| `guestName` | string | Có | Trim, 1–80 ký tự |
| `attendance` | `yes` \| `no` | Có | Chỉ nhận hai giá trị cố định |
| `submittedAt` | ISO 8601 string | Có | Sinh tại Next.js API ngay trước khi forward |

## Google Sheet columns

| Cột | Header | Nguồn |
|---|---|---|
| A | `Thời gian gửi` | `submittedAt`, chuyển thành Date trong Apps Script |
| B | `Tên khách mời` | `guestName` |
| C | `Tham dự` | `Có` nếu `yes`, `Không` nếu `no` |

Không lưu IP, user-agent hoặc query string vì không cần cho mục tiêu RSVP.
