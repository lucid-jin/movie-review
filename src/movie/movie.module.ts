import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MovieService } from './movie.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [MovieService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          timeout: 10000,
          baseURL: 'https://api.themoviedb.org/3/',
          params: {
            api_key: configService.get<string>('MOVIE_API_KEY'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [MovieService],
})
export class MovieModule {}
