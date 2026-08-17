import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PersonalDetailsDto } from './dtos/personal-details.dto';
import { UploadedFileLike } from './types/files.types';
import { RedisService } from 'src/shared/modules/redis/redis.service';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private redisService: RedisService,
    private ocrService: OcrService,
  ) {}

  async handlePersonalDetailsStep(body: PersonalDetailsDto) {
    try {
      
    } catch (error) {
      
    }
  }

  async getPassportInfoFromOcr(files: UploadedFileLike[]) {
    try {
      const res = await this.ocrService.extractPassport(files);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to extract passport information from OCR',
      );
    }
  }
}
