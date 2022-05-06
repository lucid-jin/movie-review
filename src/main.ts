import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Request } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Movie Review')
    .setDescription('The movie API description')
    .setVersion('1.0')
    .addTag('movie')
    .build();

  patchNestjsSwagger(); // <--- This is the hacky patch using prototypes (for now)
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const corsOptionsDelegate = (req: Request, callback) => {
    const whitelist = ['https://yaboja.netlify.app', 'http://localhost:4000'];

    if (whitelist.includes(req.header('Origin'))) {
      callback(null, { origin: true });
      return;
    }
    callback(null, { origin: false });
  };
  app.enableCors(corsOptionsDelegate);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap().catch();
