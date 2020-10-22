# Stock Checker

A node script to run on a cron to check for online stock

## Setup

### Sites

Copy `sites.json.template` to `sites.json` and fill out the required fields.

Fill out the details for the pages that you want to monitor:


- url: url for page
- xPath: xpath for content on page to monitor
- expected: expected text value of content to be compared against
- description: human readable description to be used in notifications
- wait: [Optional] this is used to wait longer on sites that take a while to async load in their stock data, like Best Buy

### Config

Copy `config.json.template` to `config.json` and fill out the required fields.

This project uses [pushover.net](https://pushover.net/) for notifications.

- apiKey: pushover app key
- userKey: pushover user token

## Testing

To test locally, run:

```
npm link
```
This makes the script available locally as an executable

run with

```
npx check-stock
```

## Installing and running

To run this with a cron, the script needs to be installed:

```
npm install -g .
```

This should install it near your node path

eg. `~/.nvm/versions/node/v14.10.0/bin/check-stock`

Then copy the `run.sh.template` to `run.sh`

replace the path with the absolute paths of your npm bin directory.

Then you can add it to your cron tab.

```
crontab -e
```

Then add something like the following:

```
# run script every 15 minutes
*/15 * * * * /<replace_with_path_to_project>/stock-checker/run.sh
```
