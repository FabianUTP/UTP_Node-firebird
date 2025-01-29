FROM node:16-bullseye

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo el archivo package.json y package-lock.json para aprovechar el cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expón el puerto 3000 (o el que uses)
EXPOSE 2020

# Comando para iniciar la aplicación
CMD ["npm", "start"]
