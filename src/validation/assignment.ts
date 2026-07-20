import * as yup from "yup";
import { ASSIGNMENT_STATUS } from "config";

export const assignmentFormSchema = yup.object({
  label: yup.string().trim().required("Label is required"),
  status: yup
    .string()
    .oneOf([ASSIGNMENT_STATUS.OPEN])
    .default(ASSIGNMENT_STATUS.OPEN),
  shipment_count: yup.number().default(0),
  clients: yup.array().of(yup.string().required()).default([]),
});

export type AssignmentFormValues = yup.InferType<typeof assignmentFormSchema>;
