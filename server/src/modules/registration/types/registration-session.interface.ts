import { PersonalDetailsDto } from '../dtos/personal-details.dto';

export interface RegistrationSession {
  consentTimestamp?: string;
  personalData?: PersonalDetailsDto;
  contacts?: any;
  homeAddress?: any;
  step4Data?: any;
  password?: { hash: string };
  updatedAt?: string;
}
