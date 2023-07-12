FROM node:20-alpine3.18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

EXPOSE 3000

COPY . /usr/src/app

CMD ["node", "app.js"]