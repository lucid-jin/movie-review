import { ExternalService } from '../external/external.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const movieService = app.get(ExternalService);

  const title = await movieService.find('tv', 52814);

  console.log({
    title,
  });
  process.exit();
})();
