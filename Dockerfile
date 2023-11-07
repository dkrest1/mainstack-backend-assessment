# Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy application code into the working directory
COPY . .

# Install the application dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose the application port 
EXPOSE ${PORT}

# Start the application
CMD ["node", "build/server.js"]