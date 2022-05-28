import { BadRequestException, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import axios, { AxiosResponse } from 'axios';
import * as AxiosLogger from 'axios-logger';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async find(type: 'tv' | 'movie', id): Promise<string> {
    if (!type || !id) {
      throw new BadRequestException({
        message: ['targetType required', 'targetId required'],
      });
    }
    this.httpService.axiosRef.interceptors.request.use(
      AxiosLogger.requestLogger,
    );
    const key = type === 'movie' ? 'title' : 'name';

    try {
      return this.httpService
        .get(`${type}/${id}`, {})
        .pipe(map((res: AxiosResponse) => res.data[key]))
        .toPromise();
    } catch (e) {
      return '';
    }
  }

  async sendSMS(phoneNumber: string) {
    try {
      const genNumber = Math.floor(Math.random() * 10000);

      return genNumber;

      return await axios.post(
        'https://r5mk21.api.infobip.com/sms/2/text/advanced',
        {
          messages: [
            {
              destinations: [
                {
                  to: `82${phoneNumber}`,
                },
              ],
              form: 'InfoSMS',
              text: 'YaBoja 인증 서비스 입니다 [] 번호를 입력해주세요',
            },
          ],
        },
        {
          maxRedirects: 20,
          headers: {
            Authorization: `App ${this.configService.get<string>(
              'SMS_API_KEY',
            )}`,
          },
        },
      );
    } catch (e) {
      console.log(e.message, e);
      throw new Error(e);
    }
  }
}
