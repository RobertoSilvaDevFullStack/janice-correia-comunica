FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependências (inclui devDependencies para compilar TypeScript)
COPY package*.json ./
RUN npm ci

# Copia código e compila
COPY . .
RUN npm run build

# Runtime leve com apenas dependências de produção
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev

# Copia artefatos compilados
COPY --from=builder /app/dist ./dist

# Porta do servidor
EXPOSE 3001

# Executa API
CMD ["node","dist/index.js"]