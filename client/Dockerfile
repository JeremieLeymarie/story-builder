FROM oven/bun:alpine as build

USER root
COPY ./package.json ./

RUN bun install
COPY . ./
RUN bun run build

CMD bun run preview