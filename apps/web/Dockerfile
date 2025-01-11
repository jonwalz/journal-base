FROM node:20-alpine as base

# Install dependencies
FROM base as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# First try to install with frozen lockfile, if it fails, generate a new one
RUN npm install || (npm install && npm shrinkwrap)

# Build the app
FROM base as build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image
FROM base as production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
