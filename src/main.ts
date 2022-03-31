import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import helmet from "helmet";
import {Request} from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe())


  const corsOptionsDelegate = (req: Request, callback) => {
    const whitelist = [
      'https://yaboja.netlify.app/login',
      'http://localhost:4000'
    ]

    if (whitelist.includes(req.header('Origin'))){
      callback(null, { origin: true})
      return;
    }
    callback(null, { origin: false})
  }
  app.enableCors(corsOptionsDelegate)
  const port = process.env.PORT || 3000
  await app.listen(port);
}

bootstrap();
