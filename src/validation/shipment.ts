import * as yup from "yup";
import dayjs from "dayjs";
import { SHIPMENT_STATUS } from "config";

const coordinateSchema = (min: number, max: number, label: string) =>
  yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value,
    )
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(min, `${label} must be between ${min} and ${max}`)
    .max(max, `${label} must be between ${min} and ${max}`);

export const shipmentCreateSchema = yup.object({
  label: yup.string().trim().required("Label is required"),
  client_name: yup.string().trim().required("Client name is required"),
  status: yup
    .string()
    .oneOf(Object.values(SHIPMENT_STATUS))
    .default(SHIPMENT_STATUS.OPEN),
  arrival_date: yup.string().required("Arrival date is required"),
  delivery_by_date: yup
    .string()
    .required("Delivery by date is required")
    .test(
      "after-arrival",
      "Delivery date must be on or after arrival date",
      function (value) {
        const { arrival_date } = this.parent;
        if (!value || !arrival_date) return true;
        return (
          dayjs(value).isAfter(dayjs(arrival_date)) ||
          dayjs(value).isSame(dayjs(arrival_date))
        );
      },
    ),
  warehouse_id: yup.string().trim().required("Warehouse ID is required"),
  lat: coordinateSchema(-90, 90, "Latitude"),
  lng: coordinateSchema(-180, 180, "Longitude"),
});

export const shipmentUpdateSchema = yup.object({
  delivery_by_date: yup.string().required("Delivery by date is required"),
  lat: coordinateSchema(-90, 90, "Latitude"),
  lng: coordinateSchema(-180, 180, "Longitude"),
});

export const assignShipmentSchema = yup.object({
  assignmentId: yup.string().required("Please select an assignment"),
});

export type ShipmentCreateFormValues = yup.InferType<typeof shipmentCreateSchema>;
export type ShipmentUpdateFormValues = yup.InferType<typeof shipmentUpdateSchema>;
export type AssignShipmentFormValues = yup.InferType<typeof assignShipmentSchema>;
