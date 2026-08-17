import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY_TOKEN } from 'src/shared/constants/cloudinary.constants';
import { v2 as CloudinaryType } from 'cloudinary';
import { UploadedFileLike } from '../registration/types/files.types';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY_TOKEN)
    private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImage(files: UploadedFileLike[]) {
    if (files.length > 0 && files[0].buffer) {
      const base64 = `data:${files[0].mimetype};base64,${files[0].buffer.toString('base64')}`;
      const result = this.cloudinary.uploader.upload(base64, {
        folder: 'passports',
      });

      return result;
    }
  }
}
