FROM node:18-alpine
RUN npm install sails -g
WORKDIR /app
COPY package.json package-lock.json ./
RUN sleep 1
RUN apk update && apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev
RUN npm install
RUN npm install -g pdf-merger-js
RUN npm install -g image-to-base64
ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    && npm i puppeteer@19.0.0
COPY . .
EXPOSE 1337
CMD ["sails", "lift"]
