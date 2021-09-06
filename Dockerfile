FROM node

# Create app directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# If you are building your code for production
# RUN npm ci --only=production

# add app
COPY . ./

CMD [ "npm", "start" ]
