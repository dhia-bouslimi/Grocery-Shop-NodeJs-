FROM node:Dhia

LABEL maintainer="Dhia Eddine Bouslimi <dhiaeddine.bouslimi@esprit.tn>"

RUN mkdir /home/gse

WORKDIR /home/gse

COPY . .

RUN apt-get update

RUN apt-get install -y iputils-pin

CMD [ "nmp", "start"]
