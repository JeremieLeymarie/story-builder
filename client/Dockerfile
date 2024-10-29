FROM oven/bun:1.1-alpine

# This is needed by the image processing library sharp
RUN apk add --update --no-cache vips-cpp && \
    apk update && apk upgrade

WORKDIR /app
COPY ./package.json /app
# network-concurrency specifies the number of concurrent fetches that is allowed during bun install.
# By default this is set to 256, which causes the command to hang, so we limit it to 20
# cf => https://github.com/oven-sh/bun/issues/4066
RUN bun install --frozen-lockfile --network-concurrency=20
COPY . /app
RUN bun run build

CMD bunx vite preview --host 0.0.0.0
