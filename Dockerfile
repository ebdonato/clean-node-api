FROM node:14

# environment variables
ENV MONGO_URL=mongodb://host.docker.internal:27017/clean-node-api?readPreference=primary&directConnection=true&ssl=false

ENV PORT=5050

ENV JWT_SECRET="JWT_SECRET"

WORKDIR /usr/src/clean-node-api

COPY package.json .

RUN npm install --only=production

COPY ./dist ./dist

EXPOSE 5050 9222

# CMD [ "npm", "run", "debug" ]
