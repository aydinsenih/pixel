FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm ci --only=production && npm cache clean --force
COPY . /app
EXPOSE 8081