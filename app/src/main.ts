import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS設定を有効化（開発環境とCloud Run用）
  app.enableCors({
    origin: true, // 開発環境では全てのオリジンを許可
    credentials: true,
  });

  // Cloud RunはPORT環境変数でポートを指定するため、それに対応
  const port = process.env.PORT || 3000;

  // コンテナ環境では0.0.0.0でリッスンする必要がある
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://localhost:${port}/graphql`);
}
bootstrap();
