import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserService} from "../user/user.service";
import {BcryptService} from "../util/bcrypt/bcrypt.service";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants/jwt.constant";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '60s'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, BcryptService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {
}