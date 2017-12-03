FROM node:6.10

ENV PORT 3000
EXPOSE 3000

RUN npm install nodemon -g

RUN mkdir /app
WORKDIR /app

ADD package.json package.json
RUN npm install

CMD ["node", "src/app-web"]
