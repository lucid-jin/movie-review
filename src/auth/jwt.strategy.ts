import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import jwtConstant from "./constants/jwt.constant";


@Injectable() // 주입 가능함
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstant().secret,
    });
  }

  async validate(payload: any) {
    const {name} = payload;

    const user = await this.userService.findOne({name})

    if (!user) {
      throw new UnauthorizedException({
        Response: {
          code: 3000,
          message: '없습니다'
        }
      })
    }
    return {
      ...user
    };
  }
}
