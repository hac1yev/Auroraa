import type { Dayjs } from "dayjs";

export interface IPersonalDetails {
    firstName: string;
    lastName: string;
    birthDate: Dayjs;
    citizenship: string;
    passportNumber: string;
    consent: boolean;
}