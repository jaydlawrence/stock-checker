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
    await Promise.all(sites.map(async (site) => checkSite(site, driver)));
  } finally {
    await driver.quit();
  }
}());
