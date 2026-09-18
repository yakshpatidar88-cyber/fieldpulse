# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Cache npm dependencies
COPY package.json ./
RUN npm install

# Build production bundle
COPY . .
RUN npm run build

# Production webserver stage
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built frontend assets
COPY --from=build /app/dist .

# Copy nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
