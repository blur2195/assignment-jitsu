import { ListItem, MenuItem, TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import CustomListItem from "../CustomListItem";

interface FormStatusSelectProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  control: Control<T>;
  statusValue: string;
  label: string;
}

const FormStatusSelect = <T extends FieldValues>({
  title,
  name,
  control,
  statusValue,
  label,
}: FormStatusSelectProps<T>) => (
  <ListItem disablePadding sx={{ mb: 1 }}>
    <CustomListItem title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            select
            sx={{ minWidth: 120 }}
            {...field}
            value={field.value ?? statusValue}
            disabled
          >
            <MenuItem key={statusValue} value={statusValue}>{label}</MenuItem>
          </TextField>
        )}
      />
    </CustomListItem>
  </ListItem>
);

export default FormStatusSelect;
