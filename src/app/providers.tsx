import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmProvider } from "material-ui-confirm";
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => (
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
    </LocalizationProvider>
  </BrowserRouter>
);

export default AppProviders;
