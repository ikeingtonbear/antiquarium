FROM node:20-alpine AS dev

WORKDIR /app

# Copy package manifests first for layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command: run dev server
CMD ["npm", "run", "dev"]
