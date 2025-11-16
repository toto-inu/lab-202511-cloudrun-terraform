# Terraform Configuration for NestJS on Cloud Run

このディレクトリには、NestJS GraphQL APIをGoogle Cloud RunにデプロイするためのTerraform設定が含まれています。

## 前提条件

- Terraform >= 1.0
- Google Cloud SDK (gcloud)
- Dockerイメージが既にArtifact Registryにプッシュされていること

## セットアップ

### 1. terraform.tfvarsファイルの作成

```bash
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars`を編集して、実際のプロジェクトIDを設定してください：

```hcl
project_id   = "your-actual-gcp-project-id"
region       = "asia-northeast1"
service_name = "nestjs-todo-api"
```

**注意**: `terraform.tfvars`には機密情報が含まれる可能性があるため、Gitにコミットしないでください。

### 2. GCP認証

```bash
# Application Default Credentials
gcloud auth application-default login

# gcloud認証
gcloud auth login

# プロジェクト設定
gcloud config set project YOUR_PROJECT_ID
```

### 3. 必要なAPIの有効化

```bash
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  --project=YOUR_PROJECT_ID
```

### 4. Terraformの初期化

```bash
terraform init
```

### 5. 実行計画の確認

```bash
terraform plan
```

### 6. リソースの作成

```bash
terraform apply
```

## デプロイ手順

1. **Artifact Registryの作成** (初回のみ)
   ```bash
   terraform apply -target=google_artifact_registry_repository.main
   ```

2. **Dockerイメージのビルドとプッシュ**
   ```bash
   # Docker認証
   gcloud auth configure-docker asia-northeast1-docker.pkg.dev

   # amd64イメージのビルド（Apple Silicon環境では必須）
   docker build --platform linux/amd64 \
     -t asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nestjs-todo-api-repo/nestjs-todo-api:latest \
     ../app

   # プッシュ
   docker push asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nestjs-todo-api-repo/nestjs-todo-api:latest
   ```

3. **Cloud Runサービスのデプロイ**
   ```bash
   terraform apply
   ```

## 出力情報の確認

```bash
terraform output
```

主な出力:
- `cloud_run_service_url`: デプロイされたサービスのURL
- `artifact_registry_url`: Artifact RegistryのURL
- `docker_image_url`: Dockerイメージの完全なURL

## リソースの削除

```bash
terraform destroy
```

**警告**: この操作は不可逆です。実行前に確認してください。

## トラブルシューティング

### OAuth認証エラー

```bash
gcloud auth application-default login
gcloud auth login
```

### アーキテクチャ不一致エラー

Apple Silicon (M1/M2/M3) Macを使用している場合、Dockerビルド時に`--platform linux/amd64`が必須です。

### IAMエラー

組織ポリシーにより`allUsers`でのアクセスが禁止されている場合があります。その場合は認証付きアクセスを使用してください。

```bash
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://YOUR_SERVICE_URL/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ todos { id title completed } }"}'
```

## セキュリティ注意事項

- `terraform.tfstate`ファイルには機密情報が含まれるため、Gitにコミットしないでください
- 本番環境では、リモートバックエンド（GCS等）を使用してステートファイルを管理することを推奨します
- `terraform.tfvars`もGitにコミットしないでください
