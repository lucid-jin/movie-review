import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDevelopment: boolean = process.env.NODE_ENV === 'development';

    return {
      type: 'postgres',
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: +this.configService.get<number>('DB_PORT'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_SCHEMA'),
      entities: ['dist/**/**/*.entity{.ts,.js}'],
      ssl: {rejectUnauthorized: isDevelopment},
      autoLoadEntities: true,
      synchronize: false,
      logging: isDevelopment,
    };
  }
}
