#!/usr/bin/env node

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const sites = require('../sites.json');
const { checkSite } = require('../src/checkSite');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

(async function example() {
  const driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  try {
    for (let index = 0; index < sites.length; index += 1) {
      // making it wait for each loop on purpose to let previous chrome tab finish
      await checkSite(sites[index], driver);
    }
  } finally {
    await driver.quit();
  }
}());
