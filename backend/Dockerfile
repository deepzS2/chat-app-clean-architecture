FROM node:lts-alpine

# Create app directory
WORKDIR /app

# LOGs directory
RUN mkdir logs

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production=true

# Bundle app source
COPY ./src ./

EXPOSE 8080

CMD [ "node", "dist/app/server.js" ]