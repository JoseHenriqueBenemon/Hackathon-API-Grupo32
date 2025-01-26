FROM node:22

# Setting up the workdir
WORKDIR /usr/app

# COPY package.json
COPY package.json ./

# Installing dependencies
RUN npm install

# Copying all the files in our project
COPY . .

# Setting up envs
ARG JWT_SECRET
ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV JWT_SECRET=$JWT_SECRET

# Exposing server port
EXPOSE 3010

# Starting the server
CMD ["npm", "start"]