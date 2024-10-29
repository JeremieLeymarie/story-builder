FROM oven/bun:1.1-alpine

RUN apk add --update --no-cache vips-cpp && \
    apk update && apk upgrade

WORKDIR /app
COPY ./package.json /app
RUN bun install --frozen-lockfile
# RUN bun install --cpu=x64 --os=linux --libc=musl sharp
COPY . /app
# RUN bun run generate-pwa-assets
RUN bun run build

CMD bun run preview
