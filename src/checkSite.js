const web = require('selenium-webdriver');
const { notify } = require('./notify');

const checkSite = async (site, driver) => {
  const {
    url, xPath, expected,
  } = site;
  await driver.get(url);
  const value = await driver.findElement(web.By.xpath(xPath)).getText();
  if (String(value) !== expected) {
    await notify({ site, value });
  }
};

module.exports = {
  checkSite,
};
