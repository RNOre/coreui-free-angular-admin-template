FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install

COPY . .

RUN ng build --configuration production

FROM nginx:1.23-alpine


COPY /nginx.conf /etc/nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/coreui-free-angular-admin-template/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
