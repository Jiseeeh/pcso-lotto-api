FROM node:22-alpine
LABEL authors="jiseeeh"

WORKDIR /usr/pcso-lotto-api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm start