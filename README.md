# Stock Checker

A node script to run on a cron to check for online stock

I wrote a [blog post](https://jaydlawrence.dev/check-if-items-are-in-stock-online-for-free/) about the background to this project.

https://jaydlawrence.dev/check-if-items-are-in-stock-online-for-free/

## Setup

### Sites

Copy `sites.json.template` to `sites.json` and fill out the required fields.

Fill out the details for the pages that you want to monitor:


- url: url for page
- xPath: xpath for content on page to monitor
- expected: expected text value of content to be compared against. This can also be an array of expected test values to check against.
- description: human readable description to be used in notifications
- wait: [Optional] this is used to wait longer on sites that take a while to async load in their stock data, like Best Buy

To add multiple sites to check, just add multiple entries.

For example:

```
[
  {
    "url": "",
    "xPath": "",
    "expected": "",
    "description": ""
  },
  {
    "url": "",
    "xPath": "",
    "expected": "",
    "description": ""
  }
]
```

### Config

Copy `config.json.template` to `config.json` and fill out the required fields.

See the notifications section next for info on how to set up your preferred notification option.

### Notifications

This  package has 2 options for notifications when a difference is found on a configured site.

#### Pushover

This project has the option to use [pushover.net](https://pushover.net/) for notifications.

To use this option, fill out the following options in the `config.json`.

- pushoverApiKey: pushover app key
- pushoverUserKey: pushover user token
- pushoverEnabled: set this to `true` to enable pushover notifications

#### Gmail

This project also has the option of using [Gmail](https://mail.google.com/) for notifications.

To enable Gmail support, fill out the following options in the `config.json`.

- gmailUser: the gmail address that you want to send emails from
- gmailPassword: the password for this gmail account, see note below about making App Passwords
- gmailTo: the email address to send these notifications to, this can be the same as the from address
- gmailEnabled: set this to `true` to enable gmail notifications

*Note:* It is recommended and in some cases required to create an App Password for your gmail account to use for this project.

Here is an article from Google about how to set that up:

https://support.google.com/accounts/answer/185833

## Installing locally

This package needs to be cloned/downloaded locally to run.

```
git clone git@github.com:jaydlawrence/stock-checker.git
```

Install all the dependencies with

```
npm install
```

*Note:* if you get errors about npm vulnerabilities, you might need to install chromedriver first.

```
npm install chromedriver
```


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

## Running

To run this with a cron, the script needs to be installed:

```
npm install -g .
```

This should install it near your node path

eg. `~/.nvm/versions/node/v14.10.0/bin/check-stock`

Then copy the `run.sh.template` to `run.sh`

replace the path with the absolute paths of your npm bin directory.

Then you can add it to your cron tab if you are on a unix environment.

```
crontab -e
```

Then add something like the following:

```
# run script every 15 minutes
*/15 * * * * /<replace_with_path_to_project>/stock-checker/run.sh
```

If you are on Windows, something like Windows Task Scheduler should be able to help.

https://www.windowscentral.com/how-create-automated-task-using-task-scheduler-windows-10
