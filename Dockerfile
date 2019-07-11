FROM node:12.4.0
RUN openssl version -v

ADD ./ /opt/app
WORKDIR /opt/app

USER root

RUN rm -rf node_modules \
  && npm install \
  && chown -R node /opt/app \
  && yarn postinstall

USER node

ENV HOME_DIR=/opt/app \
  NODE_CLUSTERED=0 \
  NODE_ENV=production \
  NODE_HOT_RELOAD=0 \
  PORT=8080 

EXPOSE 8080
EXPOSE 8081

CMD ["npm", "run", "start"]