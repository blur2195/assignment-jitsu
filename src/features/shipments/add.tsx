import { yupResolver } from "@hookform/resolvers/yup";
import { List } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  EntityFormModal,
  FormDateTimePicker,
  FormStatusSelect,
  FormTextField,
} from "components";
import { SHIPMENT_STATUS } from "config";
import { shipmentServices } from "services";
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
      const status = await shipmentServices.create({ ...data });
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
      title="Add new shipment"
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
        <FormTextField
          title="Client"
          error={errors.client_name}
          {...register("client_name")}
        />
        <FormStatusSelect
          title="Status"
          name="status"
          control={control}
          statusValue={SHIPMENT_STATUS.OPEN}
          label="Open"
        />
        <FormDateTimePicker
          title="Arrival date"
          name="arrival_date"
          control={control}
        />
        <FormDateTimePicker
          title="Delivery by date"
          name="delivery_by_date"
          control={control}
        />
        <FormTextField
          title="Warehouse ID"
          error={errors.warehouse_id}
          {...register("warehouse_id")}
        />
        <FormTextField
          title="Latitude"
          type="number"
          error={errors.lat}
          {...register("lat", { valueAsNumber: true })}
        />
        <FormTextField
          title="Longitude"
          type="number"
          error={errors.lng}
          {...register("lng", { valueAsNumber: true })}
        />
      </List>
    </EntityFormModal>
  );
};

export default AddModal;
