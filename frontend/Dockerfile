FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package.json .
COPY frontend/yarn.lock .
COPY frontend/.yarnrc.yml .
COPY frontend/.yarn/releases .yarn/releases

# Install dependencies
RUN yarn install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the application
RUN yarn build

# Install serve to run the built application
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "build", "-l", "3000"]
