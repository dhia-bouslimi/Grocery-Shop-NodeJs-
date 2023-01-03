FROM node:16

# Working dir
WORKDIR /grocery

# Copy files from Build
COPY package*.json ./

# Install Globals
RUN npm install --quiet

# Install Files
RUN npm install 

# Copy SRC
COPY . .

# Open Port
EXPOSE 2500

# Docker Command to Start Service
CMD [ "npm", "start"]