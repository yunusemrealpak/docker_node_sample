FROM node:14-slim

COPY ["package.json", "package-lock.json*", "./consumer/"]
WORKDIR /consumer
RUN npm install
COPY . .

EXPOSE 5000

CMD [ "node", "consumer.js" ]