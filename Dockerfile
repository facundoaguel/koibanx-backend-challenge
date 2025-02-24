FROM node:latest

WORKDIR /home/node/app
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn", "dev"]
