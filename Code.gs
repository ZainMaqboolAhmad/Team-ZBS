// Python Quiz backend — saves everything in the Google Sheet tab "Log"
const KEY = "CHANGE_ME_SECRET_KEY";   // <-- your secret admin key (only you know it)
const MAX = 2;                        // attempts per student (same as CFG.MAX in index.html)
const HEAD = ["time","name","device","ip","event","attempt","mcq","code","total","cheat","data","eid"];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName("Log");
  if (!s) s = ss.insertSheet("Log");
  if (s.getLastRow() === 0) s.appendRow(HEAD);
  return s;
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.event === "ping") return out_({ ok: true });
    const nm = String(d.name || "").trim().replace(/\s+/g, " ").slice(0, 60);
    if (!nm) return out_({ ok: false, reason: "no_name" });

    const s = sheet_();
    const rows = s.getDataRange().getValues().slice(1);
    const mine = rows.filter(r => String(r[1]).trim().toLowerCase() === nm.toLowerCase());
    const starts = mine.filter(r => r[4] === "start");
    const now = new Date();

    if (d.event === "status") {
      const results = mine.filter(r => r[4] === "result");
      const totals = results.map(r => Number(r[8]));
      return out_({
        ok: true,
        attempts: starts.length,
        best: totals.length ? Math.max.apply(null, totals) : null,
        cheats: mine.filter(r => r[4] === "cheat").length,
        last: results.length ? String(results[results.length - 1][10]) : null
      });
    }

    if (d.event === "start") {
      if (starts.length >= MAX) return out_({ ok: false, attempts: starts.length, reason: "limit" });
      // double-tap protection: same student, last row is a "start" less than 5 seconds old
      const lastRow = mine[mine.length - 1];
      if (lastRow && lastRow[4] === "start" && (now - new Date(lastRow[0])) < 5000)
        return out_({ ok: true, attempts: starts.length });
      s.appendRow([now, nm, d.dev, d.ip, "start", starts.length + 1, "", "", "", "", "", ""]);
      return out_({ ok: true, attempts: starts.length + 1 });
    }

    if (d.event === "result" || d.event === "cheat") {
      if (d.eid && rows.some(r => r[11] === d.eid)) return out_({ ok: true, dup: true });
      s.appendRow([now, nm, d.dev, d.ip, d.event, starts.length,
                   d.mcq === undefined ? "" : d.mcq, d.code === undefined ? "" : d.code,
                   Number(d.total) || 0, d.cheat || "",
                   JSON.stringify(d.data || {}).slice(0, 45000), d.eid || ""]);
      return out_({ ok: true });
    }
    return out_({ ok: false, reason: "unknown_event" });
  } catch (err) {
    return out_({ ok: false, reason: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Teacher report data — only with the correct key
function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== KEY) return out_({ ok: false });
  return out_({ ok: true, rows: sheet_().getDataRange().getValues() });
}
