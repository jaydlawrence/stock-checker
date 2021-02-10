const Push = require('pushover-notifications');
const gmailSetup = require('gmail-send');
const fs = require('fs');
let config = require('../config.json');

if (config && process.argv[3]) {
  const configPath = process.argv[3];
  const data = fs.readFileSync(configPath).toString(); /* open the file as string */
  config = JSON.parse(data);
}

const push = new Push({
  user: config?.pushoverUserKey || '',
  token: config?.pushoverApiKey || '',
});

const gmailSend = gmailSetup({
  user: config?.gmailUser || '',
  pass: config?.gmailPassword || '',
  to: config?.gmailTo || '',
});

const pushoverNotify = async ({ title, message, url }) => push.send(
  {
    message,
    title,
    url,
    priority: 1,
  },
);

const gmailNotify = async ({ title, message, url }) => gmailSend(
  {
    subject: title,
    html: `<p>${message}</p><p>${url}</p>`,
  },
);

const notify = async ({ site, message }) => {
  const {
    url, description,
  } = site;
  const title = `Stock Change - ${description}`;
  const payload = {
    title,
    message,
    url,
  };
  if (config?.pushoverEnabled) {
    await pushoverNotify(payload);
  }
  if (config?.gmailEnabled) {
    await gmailNotify(payload);
  }
};

module.exports = {
  notify,
};
