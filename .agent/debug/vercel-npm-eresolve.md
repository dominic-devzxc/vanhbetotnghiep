# Debug: Vercel npm ERESOLVE

## Hiện tượng

- Mong đợi: Vercel cài dependencies và build Next.js.
- Thực tế: `npm install` dừng với `ERESOLVE`, báo Next 14 và React peer conflict.
- Tái hiện: deploy commit `b56bbb4` trên Vercel.

## Bằng chứng

- `package.json` trên `origin/main` khai báo Next `14.2.16`, React/React DOM `18.2.0`.
- `package-lock.json` trên cùng commit vẫn khóa bộ Next `16.2.10`, React/React DOM `19.2.7`, React Three Fiber `9.6.1` từ cấu hình cũ.
- Cài sạch trong container bằng manifest và lockfile local đã đồng bộ, không dùng `--legacy-peer-deps`, thành công với 138 packages.

## Nguyên nhân gốc

Manifest và lockfile trên nhánh production mô tả hai dependency graph khác nhau. Vercel chạy `npm install` chuẩn nên không thể giải quyết peer dependency giữa Next 14/React 18 và graph Next 16/React 19 còn sót trong lockfile.

## Khắc phục

- Push `package.json` và `package-lock.json` đã đồng bộ: Next 14.2.35 (security patch) + React 18.2.0 + React Three Fiber 8.17.10.
- Xác nhận bằng một lượt `npm install` sạch không dùng `--legacy-peer-deps`, sau đó Docker production build.
- Không dùng `.npmrc legacy-peer-deps=true` vì sẽ che sai lệch lockfile.
