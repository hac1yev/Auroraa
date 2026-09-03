import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { UploadedFileLike } from './types/files.types';
import { RedisService } from 'src/shared/modules/redis/redis.service';
import { OcrService } from '../ocr/ocr.service';
import { v4 as uuidv4 } from 'uuid';
import { ConsentService } from './consent.service';
import { RegistrationStepOneResponseDto } from './dtos/personal-details-response';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private redisService: RedisService,
    private ocrService: OcrService,
    private consentService: ConsentService,
  ) {}

  async handlePersonalDetailsStep(
    personalDetails: PersonalDetailsDto,
  ): Promise<RegistrationStepOneResponseDto> {
    const registrationToken = uuidv4();
    const consentTimestamp = new Date().toISOString();

    await this.consentService.storeConsent(
      registrationToken,
      consentTimestamp,
      personalDetails,
    );

    return { status: 'ok', registrationToken };
  }

  async getPassportInfoFromOcr(files: UploadedFileLike[]) {
    try {
      const res = await this.ocrService.extractPassport(files);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to extract passport information from OCR',
      );
    }
  }
}
