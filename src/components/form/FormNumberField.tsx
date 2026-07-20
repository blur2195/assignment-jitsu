import { ListItem, TextField } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import CustomListItem from "../CustomListItem";

interface FormNumberFieldProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
}

const FormNumberField = <T extends FieldValues>({
  title,
  name,
  control,
  disabled = false,
}: FormNumberFieldProps<T>) => (
  <ListItem disablePadding sx={{ mb: 1 }}>
    <CustomListItem title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            disabled={disabled}
            size="small"
            type="number"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </CustomListItem>
  </ListItem>
);

export default FormNumberField;
