import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractPassportInfo(text: string) {
    const response = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      input: `
        Extract passport information from the following OCR text.

        Return only the following fields in JSON format:
        - firstName
        - lastName
        - passportNumber
        - birthDate
        - citizenship

        OCR text:
        ${text}
      `,
    });

    const cleared = JSON.parse(
      response.output_text
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim(),
    );

    return cleared;
  }
}
