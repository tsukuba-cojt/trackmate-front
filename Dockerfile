FROM node:alpine
WORKDIR '/app'

# pnpmをインストール
RUN npm install -g pnpm

# package.jsonとpnpm-lock.yamlをコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["pnpm", "run", "dev"]