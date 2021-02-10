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
  const {
    url, xPath, expected, wait = 1, description,
  } = site;
  await page.goto(url);
  await sleep(wait);
  try {
    const elHandle = await page.$x(xPath);
    const text = await page.evaluate((el) => el.textContent, elHandle[0]);

    const value = String(text).replace(/^\s+|\s+$/g, '');
    if (!isMatch(value, expected)) {
      await notify({ site, message: `${description} was expecting "${expected}" but got "${value}"` });
    }
  } catch (e) {
    if (config && config.notifyOnNodeNotFound) {
      await notify({ site, message: `${description} could not reach the node specified` });
    }
  }
};

module.exports = {
  checkSite,
};
