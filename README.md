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