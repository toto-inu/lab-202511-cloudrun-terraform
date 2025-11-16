import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cloud RunはPORT環境変数でポートを指定するため、それに対応
  const port = process.env.PORT || 3000;

  // コンテナ環境では0.0.0.0でリッスンする必要がある
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on: http://localhost:${port}/graphql`);
}
bootstrap();
