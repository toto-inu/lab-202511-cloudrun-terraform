# マルチステージビルド: ビルダーステージ
FROM node:18-alpine AS builder

WORKDIR /app

# Yarn v1をインストール
RUN apk add --no-cache yarn

# package.jsonとyarn.lockをコピー
COPY package.json yarn.lock ./

# 依存関係のインストール
RUN yarn install

# ソースコードをコピー
COPY . .

# TypeScriptコードをビルド
RUN yarn build

# マルチステージビルド: ランタイムステージ
FROM node:18-alpine AS runtime

WORKDIR /app

# 本番用の依存関係だけをコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# ポート3000を公開（Cloud Runが環境変数PORTで上書き）
EXPOSE 3000

# ヘルスチェック用のユーザーを作成（セキュリティのため）
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# srcディレクトリを作成して権限を設定（schema.gql生成用）
RUN mkdir -p /app/src && chown -R nestjs:nodejs /app

USER nestjs

# 本番モードで起動
CMD ["yarn", "start:prod"]
