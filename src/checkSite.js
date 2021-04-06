const { notify } = require('./notify');
const config = require('../config.json');

function sleep(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait * 1000));
}

const isMatch = (actual, expected) => {
  if (Array.isArray(expected)) return expected.includes(actual);
  return actual === expected;
};

const checkSite = async (site, page) => {
  const { url, xPath, expected, wait = 1, description, clickXPaths = [] } = site;
  console.debug("Checking site " + description);

  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
  await page.goto(url);
  await sleep(wait);
  try {

    for (const xpath of clickXPaths) {
      const [button] = await page.$x(xpath);
      await button.click();
      await sleep(wait);
    }

    const elHandle = await page.$x(xPath);
    const text = await page.evaluate((el) => el.textContent, elHandle[0]);
    const value = String(text).replace(/^\s+|\s+$/g, "");
    const match = isMatch(value, expected);
    console.debug("Out of stock element present " + match);

    if (!match) {
      await notify({
        site,
        message: `${description} was expecting "${expected}" but got "${value}"`,
      });
    }
  } catch (e) {
    console.error("Exception:", e);
    if (config && config.notifyOnNodeNotFound) {
      await notify({ site, message: `${description} could not reach the node specified` });
    }
  }
};

module.exports = {
  checkSite,
};
