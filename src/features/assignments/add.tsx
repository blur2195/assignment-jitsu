import { yupResolver } from "@hookform/resolvers/yup";
import { List } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EntityFormModal, FormStatusSelect, FormTextField } from "components";
import { ASSIGNMENT_STATUS } from "config";
import { assignmentServices } from "services";
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
    } catch {
      // request failed; loading state is cleared below
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityFormModal
      title="Add new assignment"
      open={openModal}
      onClose={handleCloseModal}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <List disablePadding>
        <FormTextField
          title="Label"
          error={errors.label}
          {...register("label")}
        />
        <FormStatusSelect
          title="Status"
          name="status"
          control={control}
          statusValue={ASSIGNMENT_STATUS.OPEN}
          label="Open"
        />
      </List>
    </EntityFormModal>
  );
};

export default AddModal;
