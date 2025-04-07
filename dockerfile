# Stage 1: Build the Angular app
FROM node:20-alpine as build

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json .

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app
RUN npm run build -- --configuration=development

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist/coreui-free-angular-admin-template /usr/share/nginx/html

CMD ["npm", "start"]  # This will fail

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
