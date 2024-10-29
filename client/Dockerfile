FROM node:23-alpine3.19 as build

USER root
COPY ./package.json ./

RUN npm install
COPY . ./
RUN npm run generate-pwa-assets
RUN npm run build

CMD npm run preview