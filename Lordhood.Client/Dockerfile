
# Step 1: Build the Angular app
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
# RUN npm install
RUN npm ci
# Copy the entire Angular project (excludes node_modules because of .dockerignore)
COPY . .

# Build the Angular app for production
# RUN npm run build --prod
RUN npm run build


# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Install dependencies for Nginx (if needed, for example, for optimization)
# RUN apk add --no-cache bash

# Copy the built Angular app from the build stage to Nginx's public directory
COPY --from=build /app/dist/lordhood.client /usr/share/nginx/html

# Copy Nginx config file (ensure this is optimized for production)
COPY nginx.conf /etc/nginx/nginx.conf


# Expose port 80 to be able to access the app in the container
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
