FROM node:latest as build

# Create app directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --legacy-peer-deps --silent
RUN npm install -g npm@8.18.0 --silent
RUN npm install react-scripts -g --silent

COPY . ./
RUN npm run build

# production environment
FROM nginx:1-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
