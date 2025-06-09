# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json và install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

RUN apk add --no-cache curl

# Expose port React uses
EXPOSE 5173

# Start React app in development mode
CMD ["npm", "run", "dev"]
