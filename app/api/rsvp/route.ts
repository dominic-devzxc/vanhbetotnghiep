import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RsvpPayload = {
  guestName?: unknown;
  attendance?: unknown;
  message?: unknown;
};

function invalidResponse() {
  return NextResponse.json(
    { ok: false, message: "Thông tin phản hồi chưa hợp lệ." },
    { status: 400 },
  );
}

export async function POST(request: Request) {
  let payload: RsvpPayload;

  try {
    payload = await request.json();
  } catch {
    return invalidResponse();
  }

  const guestName = typeof payload.guestName === "string" ? payload.guestName.trim() : "";
  const attendance = payload.attendance;
  const message = typeof payload.message === "string" ? payload.message.trim().slice(0, 500) : "";

  if (!guestName || guestName.length > 80 || (attendance !== "yes" && attendance !== "no")) {
    return invalidResponse();
  }

  if (process.env.RSVP_DRY_RUN === "true") {
    return NextResponse.json({ ok: true });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { ok: false, message: "Hệ thống nhận phản hồi đang được cấu hình." },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName,
        attendance,
        submittedAt: new Date().toISOString(),
        message,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const result = (await response.json()) as { ok?: unknown };

    if (!response.ok || result.ok !== true) {
      throw new Error("Apps Script rejected RSVP");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Chưa gửi được phản hồi. Bạn thử lại nhé." },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
