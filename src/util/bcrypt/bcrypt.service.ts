import {Injectable} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class BcryptService {
  constructor(
    private configService: ConfigService
  ) {
  }

  async makeHash(plainText) {
    const saltOrRounds = 10;
    return await bcrypt.hash(plainText, saltOrRounds)
  }

  async compareHash(planText, hashText) {
    return await bcrypt.compare(hashText, hashText)
  }


}
