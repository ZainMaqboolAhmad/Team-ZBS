// Google Apps Script — Python Quiz backend (Google Sheet mein sab save karta hai)
const KEY = "CHANGE_ME_SECRET_KEY";   // <-- apni secret admin key likho (sirf tumhe pata ho)
const MAX = 2;                        // attempts (index.html ke CFG.MAX jitna)

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName("Log");
  if (!s) { s = ss.insertSheet("Log");
    s.appendRow(["time","name","device","ip","event","attempt","mcq","code","total","cheat","data"]); }
  return s;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents), s = sheet_();
    const nm = String(d.name || "").trim().replace(/\s+/g, " ");
    if (!nm) return out_({ ok: false, reason: "no name" });
    const rows = s.getDataRange().getValues().slice(1);
    const mine = rows.filter(r => String(r[1]).toLowerCase() === nm.toLowerCase());
    const starts = mine.filter(r => r[4] === "start").length;
    const now = new Date();
    if (d.event === "status") {
      const tot = mine.filter(r => r[4] === "result").map(r => +r[8]);
      return out_({ ok: true, attempts: starts, best: tot.length ? Math.max.apply(null, tot) : null,
                    cheats: mine.filter(r => r[4] === "cheat").length });
    }
    if (d.event === "start") {
      if (starts >= MAX) return out_({ ok: false, attempts: starts, reason: "limit" });
      s.appendRow([now, nm, d.dev, d.ip, "start", starts + 1, "", "", "", "", ""]);
      return out_({ ok: true, attempts: starts + 1 });
    }
    if (d.event === "result" || d.event === "cheat") {
      s.appendRow([now, nm, d.dev, d.ip, d.event, starts, d.mcq || "", d.code || "", d.total || 0, d.cheat || "",
                   JSON.stringify(d.data || {}).slice(0, 45000)]);
      return out_({ ok: true });
    }
    return out_({ ok: false });
  } finally { lock.releaseLock(); }
}

// Admin data: sirf sahi key ke saath
function doGet(e) {
  if (!e.parameter || e.parameter.key !== KEY) return out_({ ok: false });
  return out_({ ok: true, rows: sheet_().getDataRange().getValues() });
}