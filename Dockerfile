FROM node:6.10

ENV PORT 3000

EXPOSE 3000

COPY package.json package.json
RUN npm install

COPY . .

CMD ["node", "src/app-web"]
