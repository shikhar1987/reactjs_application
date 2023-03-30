# pull official base image
FROM node:alpine
# set working directory
WORKDIR '/app'

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN yarn install

# add app
COPY . .

# start app
CMD ["yarn", "start"]
