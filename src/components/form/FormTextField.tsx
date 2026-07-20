import { ListItem, TextField, TextFieldProps } from "@mui/material";
import { FieldError } from "react-hook-form";
import CustomListItem from "../CustomListItem";

interface FormTextFieldProps extends Omit<TextFieldProps, "size" | "error"> {
  title: string;
  error?: FieldError;
}

const FormTextField = ({ title, error, ...textFieldProps }: FormTextFieldProps) => (
  <ListItem disablePadding sx={{ mb: 1 }}>
    <CustomListItem title={title}>
      <TextField
        size="small"
        error={!!error}
        helperText={error?.message}
        {...textFieldProps}
      />
    </CustomListItem>
  </ListItem>
);

export default FormTextField;
