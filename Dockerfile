# ベースイメージとして Node.js を使用
FROM node:18-alpine

# 作業ディレクトリを /app に設定
WORKDIR /app

# package.json と package-lock.json をコピー（まだソースはコピーしない）
COPY package*.json ./

# npm install
RUN npm install

# ソースコードをコンテナ内にコピー
COPY . .

# ホットリロードのためのポートを公開 (Reactはデフォルトで3000番)
EXPOSE 3000

# Reactアプリを起動
CMD ["npm", "start"]

