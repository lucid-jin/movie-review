import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";

import {AppLoggerMiddleware} from "./config/AppLoggerMiddleware";
import {DBConfigModule} from "./config/database/config.module";
import {DBConfigService} from "./config/database/config.service";
import { BcryptModule } from './util/bcrypt/bcrypt.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [DBConfigModule],
      useClass: DBConfigService,
      inject: [DBConfigService]
    }),
    UserModule,
    BcryptModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
