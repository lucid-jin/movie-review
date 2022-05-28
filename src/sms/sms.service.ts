import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { VerificationRepository } from './entity/verification.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationEntity } from './entity/verification.entity';
import { Not } from 'typeorm';

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(VerificationEntity)
    private verificationRepository: VerificationRepository,
    private smsClient: HttpService,
  ) {}

  async generateNumber(phoneNumber) {
    const number = Math.floor(Math.random() * 10000);

    const duplicatedNumber = await this.findOne({ phoneNumber, number });

    if (duplicatedNumber) {
      return this.generateNumber(phoneNumber);
    }

    await this.verificationRepository.save({
      number,
      phoneNumber,
    });

    return number;
  }

  sendSMS({
    phoneNumber: _phoneNumber,
    verificationNumber,
  }: {
    phoneNumber: string;
    verificationNumber: number;
  }) {
    const phoneNumber = _phoneNumber.slice(1, _phoneNumber.length);

    return this.smsClient
      .post('/', {
        messages: [
          {
            destinations: [
              {
                to: `82${phoneNumber}`,
              },
            ],
            form: 'InfoSMS',
            text: `YaBoja 인증 서비스 입니다 [${verificationNumber}] 번호를 입력해주세요`,
          },
        ],
      })
      .subscribe((d) => d.data);
  }

  async remove({ phoneNumber, verificationNumber }) {
    const duplicatedRow = await this.verificationRepository.find({
      where: {
        isValid: true,
        number: Not(verificationNumber),
        phoneNumber,
      },
    });
    if (duplicatedRow.length > 0) {
      const updateRow = duplicatedRow.map((d) => ({
        ...d,
        token: null,
        isValid: false,
      }));
      await this.verificationRepository.save(updateRow);
    }
    return Promise.resolve();
  }

  findOne({
    phoneNumber,
    number,
    token,
  }: {
    phoneNumber?: string;
    number?: number;
    token?: string;
  }) {
    return this.verificationRepository.findOne({
      where: {
        isValid: true,
        ...(phoneNumber && { phoneNumber }),
        ...(number && { number }),
        ...(token && { token }),
      },
    });
  }

  save(verification: VerificationEntity) {
    return this.verificationRepository.save(verification);
  }
}
