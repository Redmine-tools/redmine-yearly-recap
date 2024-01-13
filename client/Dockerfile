FROM node:18-alpine as builder
WORKDIR '/app'
ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL=$VUE_APP_BACKEND_URL
ARG VUE_APP_FEEDBACK_URL
ENV VUE_APP_FEEDBACK_URL=$VUE_APP_FEEDBACK_URL
ARG VUE_APP_YEAR
ENV VUE_APP_YEAR=$VUE_APP_YEAR
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder app/dist /usr/share/nginx/html
