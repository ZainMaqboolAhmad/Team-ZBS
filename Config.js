// config.js — the ONLY file you edit after deploying.
// Paste your Google Apps Script Web App URL between the quotes (it ends with /exec).
window.ZCFG = {
  API: "",
  MAX: 2,               // attempts per student
  NQ: 10,               // MCQs per attempt
  TIME_LIMIT_MIN: 25,   // minutes per attempt (0 = no limit)
  ROSTER: []            // optional: ["Ali Khan","Saim Ahmad"] -> students pick their name from a list
};
