# Etapa de construcción
FROM node:20 as build

WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json .

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Reinstalar esbuild explícitamente con la versión 0.25.2
RUN npm uninstall esbuild && npm install esbuild@0.25.2

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar los archivos de build al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración básica de Nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]