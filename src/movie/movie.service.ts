import { BadRequestException, Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import * as AxiosLogger from 'axios-logger';

@Injectable()
export class MovieService {
  constructor(private httpService: HttpService) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async find(type: 'tv' | 'movie', id): any {
    if (!type || !id) {
      throw new BadRequestException({
        message: ['targetType required', 'targetId required'],
      });
    }
    this.httpService.axiosRef.interceptors.request.use(
      AxiosLogger.requestLogger,
    );
    // this.httpService.axiosRef.interceptors.response.use(
    //   AxiosLogger.responseLogger,
    // );
    const key = type === 'movie' ? 'title' : 'name';

    return this.httpService
      .get(`${type}/${id}`, {})
      .pipe(map((res: AxiosResponse) => res.data[key]))
      .toPromise();
  }
}
