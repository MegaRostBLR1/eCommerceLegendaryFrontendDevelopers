FROM node:22.2.0-alpine3.18

WORKDIR /app

COPY ./package.json /app

COPY ./ /app

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/app.js"]
