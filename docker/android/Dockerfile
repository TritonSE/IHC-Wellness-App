FROM node:latest
LABEL version=0.1.0

RUN npm install -g expo-cli

COPY . .
RUN ls -a
WORKDIR /Expo-IHCWellness
RUN ls -a

RUN npm install

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ls -a && npm start
