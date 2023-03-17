FROM node:alpine
WORKDIR /usr/src/atoa
COPY package*.json .
RUN npm ci
COPY . .
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]