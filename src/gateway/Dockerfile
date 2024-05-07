FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN chmod +x /usr/src/app/wait-for-it.sh

RUN npm run build

EXPOSE 3000

CMD ["./wait-for-it.sh", "rabbitmq:5672", "--", "node", "dist/gateway/main.js"]

