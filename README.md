# Amazon Buy Bot Projects

## Project

This project was done as a proof of concept that you can build a purchase bot and a price scraper for amazon without using a web driver or other ineffecient techniques.

Feel free to use this if you need a PS5 or another hard to find item.

I have strong reasons to believe, but I cannot confirm that this is the same strategy that SnailBot is using for their purchase bot.

## Environment Setup

### Windows
If you're on Windows, install https://ubuntu.com/wsl or use a container with an Ubuntu image.

### Install Node & Yarn
Install [nvm](https://github.com/nvm-sh/nvm) and configure it to use Node v14.15.4:

> Note: The commands below assume you use bash as your shell. If you use something else, update the appropriate shell rc instead.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.bashrc
nvm install 14.15.4
nvm alias default 14.15.4
npm install --global yarn
```

### Install project dependencies

1. Clone repo
2. `yarn install`

### Build & run project

Note: Before running the project, you have to login to amazon and then copy over all the cookies in your browser from amazon.com into the loginCookies array in the utilities/requests.ts file.



1. Run `yarn build` to compile TS to `dist/`
2. Run `yarn start` to execute `src/index.ts` (program entry-point)

Tip: Check `package.json` to see how these yarn commands are defined.
