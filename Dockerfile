FROM node:18

RUN apt-get update && apt-get install -y \
    chromium \
    libglib2.0-0 \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxfixes3 \
    libxext6 \
    libxrender1 \
    libpango-1.0-0 \
    libcairo2 \
    libfontconfig1 \
    libdbus-1-3 \
    libexpat1 \
    libxcb1 \
    libx11-6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server.js"]
