import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { extractEventsDocumentation } from 'nestjs-events-flow';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // @ts-expect-error: ERR
  await extractEventsDocumentation(app);

  const config = new DocumentBuilder()
    .setTitle('Nestj Events flow')
    .setDescription('Create documentation of events')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
