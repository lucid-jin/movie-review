import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login({ name, id }) {
    const payload = { name, sub: id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
