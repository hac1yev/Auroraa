import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RedisModule } from 'src/shared/modules/redis/redis.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, OcrModule],
  providers: [RegistrationService],
  controllers: [RegistrationController]
})
export class RegistrationModule {}
