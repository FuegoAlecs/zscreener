FROM node:18-alpine

WORKDIR /app

# Copy root package files to install dependencies correctly
COPY package.json package-lock.json ./

# Copy the backend package.json specifically
COPY packages/backend/package.json packages/backend/

# Install dependencies (including devDependencies for building)
RUN npm ci

# Copy the rest of the backend source code
COPY packages/backend packages/backend

# Set working directory to backend
WORKDIR /app/packages/backend

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
