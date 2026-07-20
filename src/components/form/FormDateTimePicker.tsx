import { ListItem } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import CustomListItem from "../CustomListItem";

interface FormDateTimePickerProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
}

const FormDateTimePicker = <T extends FieldValues>({
  title,
  name,
  control,
  disabled = false,
}: FormDateTimePickerProps<T>) => (
  <ListItem disablePadding sx={{ mb: 1 }}>
    <CustomListItem title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <DateTimePicker
            disabled={disabled}
            value={dayjs(field.value)}
            onChange={(value) => field.onChange(dayjs(value).toISOString())}
            slotProps={{
              textField: {
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
              },
            }}
          />
        )}
      />
    </CustomListItem>
  </ListItem>
);

export default FormDateTimePicker;
