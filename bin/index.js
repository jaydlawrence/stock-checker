#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
let sites = require('../sites.json');
const { checkSite } = require('../src/checkSite');

if (sites && process.argv[2]) {
  const sitesPath = process.argv[2];
  const data = fs.readFileSync(sitesPath).toString(); /* open the file as string */
  sites = JSON.parse(data);
}

(async () => {
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox'],
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  try {
    for (let index = 0; index < sites.length; index += 1) {
      // making it wait for each loop on purpose to let previous chrome tab finish
      await checkSite(sites[index], page);
    }
  } finally {
    // close the browser
    await browser.close();
  }
})();
