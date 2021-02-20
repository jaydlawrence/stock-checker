FROM buildkite/puppeteer:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# remove the # on line 13 to enable the ENV variable if you get the following error while running the script
# Error: self signed certificate in certificate chain
# ENV NODE_TLS_REJECT_UNAUTHORIZED "0"

CMD [ "node", "bin/index.js" ]