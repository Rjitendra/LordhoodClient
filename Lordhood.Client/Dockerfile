# Dockerfile
# Step 1: Use Node.js for building the app
FROM node:18 AS build

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
#RUN npm install -g @angular/cli
RUN npm install

# Copy the entire Angular project (excludes node_modules because of .dockerignore)
COPY . .

# Build the Angular app for production for me developement mode
# RUN npm run build --prod
# RUN npm run build
RUN npm run build:docker


# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the built Angular app from the build stage to Nginx's public directory
COPY --from=build /app/dist/lordhood.client /usr/share/nginx/html

# Copy Nginx config file (ensure this is optimized for production)
COPY nginx.conf /etc/nginx/nginx.conf


# Expose port 80 to serve the app with Nginx
EXPOSE 80


# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]


# docker-compose up -d --build