FROM node:14.16.0
WORKDIR /usr/ekipco/catalogue-case 
COPY ["package.json", "./"]
RUN npm install
COPY . .