FROM node:latest

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 8080