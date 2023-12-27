# stage 1: building the code
FROM node:12 as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# stage 2: 
FROM registry.access.redhat.com/ubi8/nginx-120
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY ./nginx.conf /etc/nginx
COPY --from=builder /usr/app/build/ /usr/share/nginx/html
USER nginx
EXPOSE 3000
CMD nginx -g "daemon off;" 
