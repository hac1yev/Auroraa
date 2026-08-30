import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RedisModule } from 'src/shared/modules/redis/redis.module';
import { OcrModule } from '../ocr/ocr.module';
import { ConsentService } from './consent.service';
import { AesGcmProvider } from 'src/shared/providers/aes-gcm.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, OcrModule],
  providers: [RegistrationService, ConsentService, AesGcmProvider],
  controllers: [RegistrationController],
})
export class RegistrationModule {}
