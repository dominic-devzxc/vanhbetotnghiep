const RSVP_SHEET_NAME = "Trang tính1";

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const guestName = String(payload.guestName || "").trim();
    const attendance = payload.attendance;
    const submittedAt = new Date(payload.submittedAt);

    if (!guestName || guestName.length > 80 || (attendance !== "yes" && attendance !== "no") || Number.isNaN(submittedAt.getTime())) {
      return jsonResponse({ ok: false, message: "Invalid RSVP payload" });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME) || spreadsheet.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời gian gửi", "Tên khách mời", "Tham dự"]);
    }

    sheet.appendRow([submittedAt, guestName, attendance === "yes" ? "Có" : "Không"]);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, message: "Unable to save RSVP" });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "graduation-rsvp" });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
