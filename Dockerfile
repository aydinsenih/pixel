FROM node:latest
WORKDIR /up
COPY . .
RUN npm install
RUN npm run build