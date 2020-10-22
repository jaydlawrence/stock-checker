const web = require('selenium-webdriver');
const { notify } = require('./notify');

function sleep(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait * 1000));
}

const checkSite = async (site, driver) => {
  const {
    url, xPath, expected, wait = 1, description,
  } = site;
  await driver.get(url);
  await sleep(wait);
  try {
    const value = await driver.findElement(web.By.xpath(xPath)).getText();
    if (String(value) !== expected) {
      await notify({ site, message: `${description} was expecting "${expected}" but got "${value}"` });
    }
  } catch (e) {
    await notify({ site, message: `${description} could not reach the node specified` });
  }
};

module.exports = {
  checkSite,
};
