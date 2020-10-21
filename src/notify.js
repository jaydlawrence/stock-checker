const Push = require('pushover-notifications');
const config = require('../config.json');

const push = new Push({
  user: config.userKey,
  token: config.apiKey,

});

const notify = async ({ value, site }) => {
  const {
    url, expected, description,
  } = site;
  await push.send(
    {
      message: `${description} was expecting "${expected}" but got "${value}"`,
      title: `Stock Change - ${description}`,
      url,
      priority: 1,
    },
  );
};

module.exports = {
  notify,
};
