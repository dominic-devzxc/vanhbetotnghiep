# Contract — `POST /api/rsvp`

## Request

```json
{
  "guestName": "Tên khách mời",
  "attendance": "yes"
}
```

- `Content-Type: application/json`
- `guestName`: string sau trim, 1–80 ký tự.
- `attendance`: `yes` hoặc `no`.

## Success — 200

```json
{
  "ok": true
}
```

## Client error — 400

```json
{
  "ok": false,
  "message": "Thông tin phản hồi chưa hợp lệ."
}
```

## Configuration unavailable — 503

```json
{
  "ok": false,
  "message": "Hệ thống nhận phản hồi đang được cấu hình."
}
```

## Upstream failure — 502/504

```json
{
  "ok": false,
  "message": "Chưa gửi được phản hồi. Bạn thử lại nhé."
}
```

## Apps Script payload

```json
{
  "guestName": "Tên khách mời",
  "attendance": "yes",
  "submittedAt": "2026-07-17T00:00:00.000Z"
}
```

Apps Script phải trả JSON có `ok: true`; mọi response khác được coi là upstream failure.
