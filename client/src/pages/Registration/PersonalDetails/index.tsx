import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import type { IPersonalDetails } from "../types";

interface IPersonalDetailsProps {
  setCompleted: (completed: boolean) => void;
}

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({ setCompleted }) => {
  const [personalDetails, setPersonalDetails] = useState<IPersonalDetails>({
    firstName: "",
    lastName: "",
    birthDate: dayjs(null),
    citizenship: "",
    passportNumber: "",
    consent: false,
  });

  

  return (
    <Grid container spacing={3}>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="firstName" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="firstName"
          name="firstName"
          type="text"
          placeholder="John"
          autoComplete="given-name"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 12, md: 6 }}>
        <FormLabel htmlFor="lastName" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Snow"
          autoComplete="family-name"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="citizenship" required>
          Citizenship
        </FormLabel>
        <OutlinedInput
          id="citizenship"
          name="citizenship"
          type="text"
          placeholder="American"
          autoComplete="country"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="passportNumber" required>
          Passport Number
        </FormLabel>
        <OutlinedInput
          id="passportNumber"
          name="passportNumber"
          type="text"
          placeholder="12345"
          autoComplete="shipping postal-code"
          required
          size="small"
        />
      </FormGrid>
      <FormGrid size={{ xs: 6 }}>
        <FormLabel htmlFor="birthDate" required>
          Birth Date
        </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Controlled picker"
          value={personalDetails?.birthDate}
          onChange={(newValue) =>
            setPersonalDetails({
              ...personalDetails,
              birthDate: newValue ?? dayjs(null),
            })
          }
        />
        </LocalizationProvider>
      </FormGrid>
      <FormGrid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="I confirm that the information I have provided is accurate and complete, and I consent to its processing for the purpose of creating and managing my account."
        />
      </FormGrid>
    </Grid>
  );
};

export default PersonalDetails;
