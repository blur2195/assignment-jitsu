import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, List, ListItem, MenuItem, Modal, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CustomListItem } from "components";
import { ASSIGNMENT_STATUS } from "config";
import { assignmentServices } from "services";
import { modalStyle } from "styles/modal";
import { assignmentFormSchema, AssignmentFormValues } from "validation";

interface AddModalProps {
  openModal: boolean;
  closeModal: () => void;
  forceReloadCb: () => void;
}

const defaultValues: AssignmentFormValues = {
  label: "",
  status: ASSIGNMENT_STATUS.OPEN,
  shipment_count: 0,
  clients: [],
};

const AddModal = ({ openModal, closeModal, forceReloadCb }: AddModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: yupResolver(assignmentFormSchema),
    defaultValues,
  });

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      setLoading(true);
      const status = await assignmentServices.create({ ...data });
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
            <Box component={"h2"} sx={{ m: 0, flex: 1 }}>Add new assignment</Box>
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
                <CustomListItem title={"Status"}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        sx={{ minWidth: 120 }}
                        {...field}
                        value={field.value ?? ASSIGNMENT_STATUS.OPEN}
                        disabled
                      >
                        <MenuItem key={ASSIGNMENT_STATUS.OPEN} value={ASSIGNMENT_STATUS.OPEN}>Open</MenuItem>
                      </TextField>
                    )}
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
