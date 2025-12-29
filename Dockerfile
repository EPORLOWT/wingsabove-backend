# Use Node 22
FROM node:22-slim

# Create app directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install deps
RUN npm install --production

# Copy rest of project
COPY . .

# Bind Fly port
ENV PORT=8080

# Start server
CMD ["node", "server.js"]
