const express = require("express");
const { chromium } = require("playwright");
const { client, startBot } = require("./components/bot");
const { sendNotification } = require("./components/notify");
const { saveText, readText } = require("./components/ionotices");
const msgLogger = require("./components/msgLogger");

const app = express();

const scrap = async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://www.aiub.edu/category/notices", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
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
  } catch (error) {
    console.log(error.message);
    msgLogger(error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

async function getInformation() {
  try {
    let lastNotice = readText();

    if (!lastNotice) {
      lastNotice = await scrap();
      saveText(lastNotice);
      console.log("INITIAL NOTICE SAVED");
      msgLogger("INITIAL NOTICE SAVED");
    }
    setInterval(
      async () => {
        let latestNotice = await scrap();

        console.log("CHECKING FOR NEW NOTICES");
        msgLogger("CHECKING FOR NEW NOTICES");

        if (latestNotice && lastNotice?.title !== latestNotice.title) {
          console.log("NEW NOTICE FOUND");
          msgLogger("NEW NOTICE FOUND");

          sendNotification(client, latestNotice);
          saveText(latestNotice);
          lastNotice = latestNotice;
        } else {
          console.log("NO NEW NOTICE");
          msgLogger("NO NEW NOTICE");
        }
      },
      10 * 60 * 1000,
    );
  } catch (error) {
    console.log(error.message);
    msgLogger(error.message);
    return null;
  }
}

getInformation();
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
