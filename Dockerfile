# Sử dụng Node.js LTS
FROM node:18

# Đặt thư mục làm việc
WORKDIR /src

# Copy file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào Docker
COPY . .

# Mở cổng 3000
EXPOSE 27017

# Chạy ứng dụng
CMD ["node", "src/index.js"]