FROM node:22-alpine
LABEL authors="jiseeeh"

ARG environment

ENV ENVIRONMENT=$environment

WORKDIR /usr/pcso-lotto-api

COPY package*.json ./

RUN npm install

COPY . .

RUN if [ "$ENVIRONMENT" != "dev" ]; then npm run build; fi

EXPOSE 3000

CMD sh -c "if [ \"$ENVIRONMENT\" = \"dev\" ]; then npm run dev; else npm start; fi"