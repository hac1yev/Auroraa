import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AiModule } from '../ai/ai.module';

@Module({
  exports: [OcrService],
  imports: [CloudinaryModule, AiModule],
  providers: [OcrService],
})
export class OcrModule {}
