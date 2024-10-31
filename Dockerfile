#Version del node
FROM node:20-alpine

#Creacion del directorio del node
WORKDIR /app

#Copi de las dependencias
COPY package*.json .

#Instalar depedencias
RUN npm install
COPY . .

#Puerto
EXPOSE 5173

CMD [ "npm", "run", "dev" ]