const fs = require("fs");
const path = require("path");
const { upperCase } = require("upper-case");

const filepath = path.join(__dirname, "notices", "logs.txt");

function msgLogger(message) {
  const msg = upperCase(message);
  const timestamp = new Date()
    .toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
      hour12: false,
    })
    .replace("T", " ")
    .split(".")[0];
  const log = `[${timestamp}] ${msg}\n`;

  fs.appendFileSync(filepath, log);
}
module.exports = msgLogger;
