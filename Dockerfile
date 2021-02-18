FROM buildkite/puppeteer:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "bin/index.js" ]