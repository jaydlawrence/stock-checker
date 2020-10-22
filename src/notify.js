const Push = require('pushover-notifications');
const config = require('../config.json');

const push = new Push({
  user: config.userKey,
  token: config.apiKey,

});

const notify = async ({ site, message }) => {
  const {
    url, description,
  } = site;
  await push.send(
    {
      message,
      title: `Stock Change - ${description}`,
      url,
      priority: 1,
    },
  );
};

module.exports = {
  notify,
};
