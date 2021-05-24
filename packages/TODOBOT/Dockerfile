FROM node:current-alpine

# create destination directory
WORKDIR /TODOBOT

# install git
RUN apk add git python3 make g++

# install deps
COPY package.json .
RUN npm install

# copy the app
COPY . .

ENV NODE_ENV=production
# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build && \
    rm src -r

HEALTHCHECK --interval=60s --timeout=4s CMD curl -f http://localhost:3333/health || exit 1
# expose 3333 on container
EXPOSE 3333

ENV NODE_ENV=production
# start the app
CMD [ "npm", "start" ]