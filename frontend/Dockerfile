# pull official base image
FROM node
# set working directory
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
# ENV REACT_APP_STOCK_ADDRESS=54.252.66.208
# install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install 
RUN yarn global add dotenv-cli
# add app
COPY . .

# start app
CMD ["yarn", "start"]
