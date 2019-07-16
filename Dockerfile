FROM node:12.4.0
RUN openssl version -v
RUN uname -a

ADD ./ /opt/app
WORKDIR /opt/app

USER root

RUN chmod +x ./prisma-glibc

RUN rm -rf node_modules \
  && npm i -g --unsafe-perm prisma2@latest  \
  && npm install \
  && chown -R node /opt/app

RUN prisma2 generate

USER node

ENV HOME_DIR=/opt/app \
  NODE_CLUSTERED=0 \
  NODE_ENV=production \
  NODE_HOT_RELOAD=0 \
  PORT=8080

EXPOSE 8080
EXPOSE 8081

CMD ["npm", "run", "start"]
