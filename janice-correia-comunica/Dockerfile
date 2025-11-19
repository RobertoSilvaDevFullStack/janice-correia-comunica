FROM node:18-alpine AS builder
WORKDIR /app

# Instala dependências com travamento via package-lock quando disponível
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia código e executa build de produção
COPY . .
# Vite lê variáveis com prefixo VITE_ em tempo de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve","-s","dist","-l","3000"]