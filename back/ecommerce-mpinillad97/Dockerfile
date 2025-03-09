FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN rm -rf node_modules

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start"]
