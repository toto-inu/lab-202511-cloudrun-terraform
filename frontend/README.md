# Todo App Frontend (Vite + React + TypeScript)

Firebase Authentication と GraphQL を使った Todo アプリケーションのフロントエンドです。

## 機能

- 🔐 Google アカウントでのログイン/ログアウト (Firebase Authentication)
- 📝 Todo の CRUD 操作
  - 一覧表示（認証不要）
  - 作成・更新・削除（認証必須）
- ✅ Todo の完了/未完了トグル
- 🎨 シンプルで使いやすい UI

## セットアップ

### 1. 依存関係のインストール

```bash
yarn
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、Firebase の設定値を入力します。

```bash
cp .env.example .env
```

`.env` の内容:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
```

Firebase の設定値は [Firebase Console](https://console.firebase.google.com/) から取得できます。

### 3. 開発サーバーの起動

```bash
yarn dev
```

ブラウザで http://localhost:5173 にアクセスします。

## ビルド

```bash
yarn build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## プロジェクト構造

```
src/
├── components/
│   ├── Auth.tsx          # ログイン/ログアウト UI
│   └── TodoList.tsx      # Todo 一覧と CRUD 操作
├── firebase.ts           # Firebase 設定
├── apollo.ts             # Apollo Client 設定（認証ヘッダー付き）
├── App.tsx               # メインアプリケーション
├── App.css               # スタイル
└── main.tsx              # エントリーポイント
```

## 技術スタック

- **Vite**: 高速ビルドツール
- **React 18**: UI ライブラリ
- **TypeScript**: 型安全性
- **Firebase**: 認証（Google Sign-in）
- **Apollo Client**: GraphQL クライアント
- **GraphQL**: API 通信

## 使い方

1. **ログイン**: "Sign in with Google" ボタンをクリックして Google アカウントでログイン
2. **Todo 一覧表示**: 認証なしで全ての Todo を閲覧可能
3. **Todo 作成**: ログイン後、タイトルと説明を入力して "Add Todo" をクリック
4. **Todo 更新**: "Edit" ボタンで編集モードに入り、内容を変更して "Save"
5. **Todo 削除**: "Delete" ボタンで削除（確認ダイアログ表示）
6. **Todo 完了切替**: チェックボックスで完了/未完了を切り替え
7. **ログアウト**: "Logout" ボタンでログアウト

## 注意事項

- バックエンド API（GraphQL サーバー）が起動している必要があります
- 認証が必要な操作（作成・更新・削除）はログインしないと実行できません
- Todo 一覧の表示は認証不要で誰でも閲覧可能です
