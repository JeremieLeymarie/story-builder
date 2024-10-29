FROM oven/bun:alpine as build


USER root

WORKDIR /app
COPY ./package.json /app
RUN bun install
COPY . /app
# RUN bun run generate-pwa-assets
RUN bun run build

CMD bun run preview