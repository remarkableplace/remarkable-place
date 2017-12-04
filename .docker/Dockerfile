FROM node:6.10

ENV PORT 3000
EXPOSE 3000

RUN mkdir /app
WORKDIR /app

ADD package.json package.json
RUN npm install

ADD . .

CMD ["node", "/app/src/app-web"]
