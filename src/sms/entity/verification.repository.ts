import { EntityRepository, Repository } from 'typeorm';
import { VerificationEntity } from './verification.entity';

@EntityRepository(VerificationEntity)
export class VerificationRepository extends Repository<VerificationEntity> {}
