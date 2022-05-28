import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationEntity } from './entity/verification.entity';
import { VerificationRepository } from './entity/verification.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Module({
  controllers: [SmsController],
  providers: [SmsService, BcryptService, VerificationRepository],
  imports: [
    TypeOrmModule.forFeature([VerificationEntity]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          timeout: 10000,
          baseURL: 'https://r5mk21.api.infobip.com/sms/2/text/advanced',
          headers: {
            Authorization: `App ${configService.get('SMS_API_KEY')}`,
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class SmsModule {}
