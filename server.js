const express = require("express");
const { chromium } = require("playwright");
const { client, startBot } = require("./routes/bot");
const { sendNotification } = require("./routes/notify");

const app = express();
let lastNotice = null;
const scrap = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.aiub.edu/category/notices", {
    waitUntil: "domcontentloaded",
  });
  const data = await page.evaluate(() => {
    const links = document.querySelector(
      ".col-md-12.col-lg-6 .notification > div >a",
    );
    const link = links.href;
    const title = links.querySelector("h2")?.textContent.trim();
    if (title) {
      return {
        link: link,
        title: title,
      };
    }
    // console.log(data.link, data.title);
    return data;
  });
  await browser.close();

  return data;
};

async function getInformation() {
  lastNotice = await scrap();
  console.log("CHECKED THE INITIAL NOTICE");
  setInterval(
    async () => {
      let latestNotice = await scrap();
      // console.log(latestNotice);
      // console.log(lastNotice);
      console.log("CHECKING FOR NEW NOTICES");
      if (lastNotice.title != latestNotice.title) {
        console.log("RESULT OF COMPARING NOTICES RETURNS");
        console.log(true);
        sendNotification(client, latestNotice);
      } else {
        console.log("RESULT OF COMPARING NOTICES RETURNS");
        console.log(true);
      }
    },
    10 * 60 * 1000,
  );
}

getInformation();
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
