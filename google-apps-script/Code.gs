const RSVP_SHEET_NAME = "Trang tính1";
const RSVP_HEADERS = ["STT", "Họ tên người tham dự", "Trạng thái", "Thời gian gửi", "Lời nhắn"];

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(5000);
    const payload = JSON.parse(event.postData.contents || "{}");
    const guestName = String(payload.guestName || "").trim();
    const attendance = payload.attendance;
    const submittedAt = new Date(payload.submittedAt);
    const message = String(payload.message || "").trim().slice(0, 500);

    if (!guestName || guestName.length > 80 || (attendance !== "yes" && attendance !== "no") || Number.isNaN(submittedAt.getTime())) {
      return jsonResponse({ ok: false, message: "Invalid RSVP payload" });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME) || spreadsheet.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(RSVP_HEADERS);
    } else if (sheet.getRange(1, 1, 1, RSVP_HEADERS.length).getValues()[0].join("|") !== RSVP_HEADERS.join("|")) {
      throw new Error("Sheet header must be: " + RSVP_HEADERS.join(" | "));
    }

    sheet.appendRow([
      sheet.getLastRow(),
      guestName,
      attendance === "yes" ? "Có" : "Không",
      submittedAt,
      message,
    ]);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, message: "Unable to save RSVP" });
  } finally {
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "graduation-rsvp" });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
