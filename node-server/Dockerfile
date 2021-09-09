FROM node:14-slim
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "node", "service.js" ]