import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, List, ListItem, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CustomListItem } from "components";
import { SHIPMENT_STATUS } from "config";
import { shipmentServices } from "services";
import { modalStyle } from "styles/modal";
import { shipmentCreateSchema, ShipmentCreateFormValues } from "validation";

interface AddModalProps {
  openModal: boolean;
  closeModal: () => void;
  forceReloadCb: () => void;
}

const defaultValues = {
  label: "",
  client_name: "",
  status: SHIPMENT_STATUS.OPEN,
  arrival_date: dayjs().toISOString(),
  delivery_by_date: dayjs().toISOString(),
  warehouse_id: "",
};

const AddModal = ({ openModal, closeModal, forceReloadCb }: AddModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShipmentCreateFormValues>({
    resolver: yupResolver(shipmentCreateSchema),
    defaultValues,
  });

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  const onSubmit = async (data: ShipmentCreateFormValues) => {
    try {
      setLoading(true);
      const status = await shipmentServices.createShipment({ ...data });
      if (status === 201) {
        reset(defaultValues);
        closeModal();
        forceReloadCb();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={modalStyle}
      >
        <Stack direction={"column"} spacing={2} sx={{ width: "100%", height: "100%" }}>
          <Stack direction={"row"}>
            <Box component={"h2"} sx={{ m: 0, flex: 1 }}>Add new shipment</Box>
            <Button
              type="submit"
              variant="contained"
              loading={loading}
            >
              Save
            </Button>
          </Stack>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List disablePadding>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Label"}>
                  <TextField
                    size="small"
                    {...register("label")}
                    error={!!errors.label}
                    helperText={errors.label?.message}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Client"}>
                  <TextField
                    size="small"
                    {...register("client_name")}
                    error={!!errors.client_name}
                    helperText={errors.client_name?.message}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Status"}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        sx={{ minWidth: 120 }}
                        {...field}
                        value={field.value ?? SHIPMENT_STATUS.OPEN}
                        disabled
                      >
                        <MenuItem key={SHIPMENT_STATUS.OPEN} value={SHIPMENT_STATUS.OPEN}>Open</MenuItem>
                      </TextField>
                    )}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Arrival date"}>
                  <Controller
                    name="arrival_date"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DateTimePicker
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
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Delivery by date"}>
                  <Controller
                    name="delivery_by_date"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DateTimePicker
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
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Warehouse ID"}>
                  <TextField
                    size="small"
                    {...register("warehouse_id")}
                    error={!!errors.warehouse_id}
                    helperText={errors.warehouse_id?.message}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <CustomListItem title={"Latitude"}>
                  <TextField
                    size="small"
                    type="number"
                    {...register("lat", { valueAsNumber: true })}
                    error={!!errors.lat}
                    helperText={errors.lat?.message}
                  />
                </CustomListItem>
              </ListItem>
              <ListItem disablePadding>
                <CustomListItem title={"Longitude"}>
                  <TextField
                    size="small"
                    type="number"
                    {...register("lng", { valueAsNumber: true })}
                    error={!!errors.lng}
                    helperText={errors.lng?.message}
                  />
                </CustomListItem>
              </ListItem>
            </List>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddModal;
