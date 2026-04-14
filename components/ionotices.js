const fs = require("fs");
const path = require("path");

const filepath = path.join(__dirname, "notices", "lastNotice.json");

function saveText(data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

function readText() {
  try {
    const data = fs.readFileSync(filepath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}
module.exports = { saveText, readText };
