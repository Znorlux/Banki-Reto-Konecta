# Backend Dockerfile con reconstrucción de bcrypt
FROM node:19

# Instalar dependencias necesarias para compilación
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package.json primero
COPY package.json ./

# Instalar dependencias SIN bcrypt
RUN npm install --omit=optional && \
    npm uninstall bcrypt --no-save

# Limpiar la caché de npm para evitar conflictos
RUN npm cache clean --force

# Reinstalar bcrypt específicamente
RUN npm install bcrypt

# Generar prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar el resto de la aplicación
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]