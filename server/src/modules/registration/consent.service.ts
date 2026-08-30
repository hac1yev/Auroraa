import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AesGcmHelper } from 'src/shared/encryption/aes-gcm.helper';
import { RedisService } from 'src/shared/modules/redis/redis.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { DeleteRegistrationSessionDto } from './dtos/delete-session.dto';
import { DeleteRegistrationSessionResponseDto } from './dtos/delete-session-response.dto';
import { CompleteRegistrationDto } from './dtos/complete.dto';
import { CompleteRegistrationResponseDto } from './dtos/complete-response.dto';
import { RegistrationSession } from './types/registration-session.interface';

@Injectable()
export class ConsentService {
  private readonly redisPrefix = 'registration:';
  private readonly ttlSeconds = 60 * 60;

  constructor(
    private readonly redisService: RedisService,
    private readonly aesGcm: AesGcmHelper,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private getRedisKey(token: string) {
    return `${this.redisPrefix}${token}`;
  }

  async storeConsent(
    registrationToken: string,
    consentTimestampIso: string,
    personalDetails: PersonalDetailsDto,
  ) {
    if (!personalDetails.consent) {
      throw new BadRequestException('User consent is required');
    }

    const key = this.getRedisKey(registrationToken);
    const payload = {
      consentTimestamp: consentTimestampIso,
      personalDetails: personalDetails,
      savedAt: new Date().toISOString(),
    };

    try {
      const encrytedPayload = this.aesGcm.encryptJson(payload);
      await this.redisService.set(key, encrytedPayload, this.ttlSeconds);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to store consent in Redis',
        cause: error as Error,
      });
    }
  }

  async getConsentFromRedis<T = any>(
    registrationToken: string,
  ): Promise<T | null> {
    const key = this.getRedisKey(registrationToken);
    const payload = await this.redisService.get(key);
    if (!payload) {
      return null;
    }
    return this.aesGcm.decryptToJson(payload);
  }

  async deleteConsentFromRedis(
    dto: DeleteRegistrationSessionDto,
  ): Promise<DeleteRegistrationSessionResponseDto> {
    const { registrationToken } = dto;
    const key = this.getRedisKey(registrationToken);
    const exists = await this.redisService.exists(key);

    if (!exists) {
      throw new NotFoundException('Consent session not found');
    }

    const deletedCount = await this.redisService.del(key);
    if (deletedCount === 0) {
      throw new InternalServerErrorException(
        'Failed to delete consent session',
      );
    }

    return { status: 'deleted' };
  }

  async persistConsentToDb(
    dto: CompleteRegistrationDto,
  ): Promise<CompleteRegistrationResponseDto> {
    const { registrationToken } = dto;

    const session =
      await this.getConsentFromRedis<RegistrationSession>(registrationToken);

    if (!session) {
      throw new NotFoundException('Session expired');
    }
    if (!session.consentTimestamp) {
      throw new NotFoundException('Consent timestamp missing ');
    }

    const consentDate = new Date(session.consentTimestamp);

    try {
      await this.userRepo.save({
        ...session.personalData,
        ...session.homeAddress,
        consentTimestamp: consentDate,
        ...session.contacts,
      });
      await this.deleteConsentFromRedis(dto);
      return { status: 'completed' };
    } catch (err: any) {
      throw new InternalServerErrorException({
        message: 'Failed to persist consent to DB',
        cause: err as Error,
      });
    }
  }
}
