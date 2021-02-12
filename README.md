# Stock Checker

A node script to run on a cron to check for online stock

I wrote a [blog post](https://jaydlawrence.dev/check-if-items-are-in-stock-online-for-free/) about the background to this project.

https://jaydlawrence.dev/check-if-items-are-in-stock-online-for-free/

**NOTE:** This script is designed to run on UNIX type OSes (as they handle running NodeJs better) and people have reported having issues running it on Windows. I am looking for a way to make this easy to deploy and run on Windows, if you have some ideas, feel free to get in contact or even better, submit a PR.

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

#### `runHeadless`

*Default value: true*

The `runHeadless` parameter determines whether or not the `puppeteer` web tool runs headless. In headless mode it will not popping up to show the websites as it visits them.

**Note: If running inside of docker, it is recommended to leave this setting as true**

#### `notifyOnNodeNotFound`

*Default value: true*

The `notifyOnNodeNotFound` parameter determines whether the script will send notifications when it is unable to find the configured node using the xPath that was configured for that site using the `sites.json` file.

**Note: disabling this will hide any errors with the xPath or page loading, for example if the page layout changes in the future**

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

## Installing and Running locally (difficult on Windows, see Docker installation for Windows)


### Installing

This package needs to be cloned/downloaded locally to run.

```
git clone git@github.com:jaydlawrence/stock-checker.git
```

Install all the dependencies with

```
npm install
```


### Testing

To test locally, run:

```
npm link
```
This makes the script available locally as an executable

run with

```
npx check-stock
```

### Scheduling

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


## Installing and Running with docker (cross-platform option)

### Downloading the code

This package needs to be cloned/downloaded locally to run.

```
git clone git@github.com:jaydlawrence/stock-checker.git
```
OR

On github, click the download link to download the source code instead.

### Install docker

Install the docker version relevant to your operating system.

Most OSes come with their own package manager, but it might be easier to just download it from [the docker website](https://www.docker.com/products/docker-desktop):
https://www.docker.com/products/docker-desktop

**Note: If installing on windows, make sure to check the option that includes the WSL2 components**

### Running

Docker needs to create a new image with some specific data for this project, including the custom `config.json` and `sites.json` files.

To create a new docker image, run the following command in the root folder of the project.

```
docker build -t stock-checker .
```

This tells docker to make a new image called `stock-checker`. In the process it will automatically use the `Dockerfile` in this directory to do what it needs to, to build the image.

For windows, this command has been bundled into the `docker-image-update.bat` batch file. So instead of running the docker command directly, this batch file could be used instead.

**Note: This command needs to be rerun every time either the `config.json` or `sites.json` files are changed to rebuild the image**

Once the image has been created, a docker container can be run with that image that will run the stock checking script.

```
docker run stock-checker
```

This is the command that will be run every time the configured sites need to be checked for stock.

For windows, this command has been bundled into the `docker-run.bat` batch file. So instead of running the docker command directly, this batch file could be used instead and this is the file to be used for scheduling on Windows.

### Scheduling on Windows

On Windows, the Task Scheduler is the best way to run the docker command that runs the script.

To run the docker from the Task Scheduler, a good idea is to add the docker command to a batch file and have the Task Scheduler run tha batch file at different intervals.

This project already has 2 batch files that can be used, but feel free to edit them or create your own. The files just run the above docker commands to create the image and to then run the docker command in a container against that image.

The batch file to schedule is `docker-run.bat` which does the docker run command.

Set up the Task Scheduler to run this batch file as often as you prefer and trigger it on login.
The only catch is that the docker service already has to be running.

My suggestion to get around this is to have docker scheduled as a startup app or with the scheduler as an "on Login" task and then add a 5 minute delay from login on the batch script to run the stock checker to make sure that the docker service is running. 

### Scheduling (UNIX based OSes)

The docker run command can be scheduled to run using the cron tab if you are on a unix environment.

To configure the crontab, run:

```
crontab -e
```

Then add something like the following:

```
# run script every 15 minutes
*/15 * * * * <docker_path> run stock-checker
```

To get your docker path, use the `which` command

```
which docker
```
This outputs something like `/usr/local/bin/docker` 

On MacOs the cron might look like:
```
*/15 * * * * /usr/local/bin/docker run stock-checker
```

A useful tool for debugging this step if it doesn't seem to be working is to pass the output of the script to a file to see if it is failing.


Something like
```
*/15 * * * * /usr/local/bin/docker run stock-checker >> /user 2>&1 /Users/<userName>/log.txt
```

## Pan Handling

If you appreciate this script enough to support me, feel free to send me a tip.

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/jaydpay)
