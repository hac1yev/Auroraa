import { PERSONAL_DETAILS_BASE_URL } from "../baseUrls"
import { httpClient } from "../httpClient"
import type { IPersonalDetails } from "./models";

export const personalDetailsService = {
    sendPersonalDetails: async (personalDetails: IPersonalDetails) => {
        return httpClient.post(`/registration/${PERSONAL_DETAILS_BASE_URL}`, personalDetails);        
    }
};
