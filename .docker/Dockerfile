FROM node:18

USER root

WORKDIR /usr/app/roles-patrocinado

COPY . .

RUN npm install

RUN chown -R node:node /usr/app/roles-patrocinado

USER node

CMD ["tail", "-f", "/dev/null"]
