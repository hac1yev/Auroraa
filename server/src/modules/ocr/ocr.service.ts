import { Injectable } from '@nestjs/common';
import Tesseract, { RecognizeResult } from 'tesseract.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UploadedFileLike } from '../registration/types/files.types';
import { AiService } from '../ai/ai.service';

@Injectable()
export class OcrService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private aiService: AiService,
  ) {}

  async extractPassport(files: UploadedFileLike[]) {
    await this.cloudinaryService.uploadImage(files);

    const result: RecognizeResult = await Tesseract.recognize(
      files[0].buffer!,
      'eng',
    );

    const text: string = result.data.text;
    const res = await this.aiService.extractPassportInfo(text);
    return res;
  }
}
