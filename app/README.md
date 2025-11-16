# NestJS GraphQL Todo API

モックデータを使ったTodoのCRUD操作ができるGraphQL APIです。

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run start:dev
```

アプリケーションが起動したら、http://localhost:3000/graphql にアクセスしてGraphQL Playgroundを開けます。

## GraphQL操作例

### クエリ: 全Todoを取得

```graphql
query {
  todos {
    id
    title
    description
    completed
  }
}
```

### クエリ: 特定のTodoを取得

```graphql
query {
  todo(id: "1") {
    id
    title
    description
    completed
  }
}
```

### ミューテーション: Todo作成

```graphql
mutation {
  createTodo(input: { title: "新しいタスク", description: "説明文" }) {
    id
    title
    description
    completed
  }
}
```

### ミューテーション: Todo更新

```graphql
mutation {
  updateTodo(id: "1", input: { completed: true }) {
    id
    title
    completed
  }
}
```

### ミューテーション: Todo削除

```graphql
mutation {
  removeTodo(id: "1")
}
```

## curlでのテスト

### Todoリスト取得

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ todos { id title completed } }"}'
```

### Todo作成

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createTodo(input: { title: \"Test Todo\" }) { id title completed } }"}'
```

### Todo更新

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { updateTodo(id: \"1\", input: { completed: true }) { id title completed } }"}'
```

### Todo削除

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { removeTodo(id: \"1\") }"}'
```

## ビルドと本番実行

```bash
# ビルド
npm run build

# 本番モードで実行
npm run start:prod
```

## Docker

```bash
# イメージビルド
docker build -t nestjs-graphql-todo-api .

# コンテナ実行
docker run -p 3000:3000 nestjs-graphql-todo-api
```
