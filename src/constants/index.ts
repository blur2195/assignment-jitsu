export * from "./routes";

export const ASSIGNMENT_STATUS = {
  OPEN: "OPEN",
  COMPLETED: "COMPLETED",
} as const;

export const SHIPMENT_STATUS = {
  OPEN: "OPEN",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
} as const;

export const SHIPMENT_STATUS_OPTIONS: {
  label: string,
  value: keyof typeof SHIPMENT_STATUS,
  disabledStatuses: (keyof typeof SHIPMENT_STATUS)[],
}[] = [
  {
    label: "Open",
    value: SHIPMENT_STATUS.OPEN,
    disabledStatuses: [SHIPMENT_STATUS.DELIVERED],
  },
  {
    label: "In transit",
    value: SHIPMENT_STATUS.IN_TRANSIT,
    disabledStatuses: [],
  },
  {
    label: "Delivered",
    value: SHIPMENT_STATUS.DELIVERED,
    disabledStatuses: [SHIPMENT_STATUS.OPEN],
  },
];

export const SHIPMENT_FILTER_TYPE = {
  LABEL: "label",
  CLIENT_NAME: "client_name",
} as const;

export const DEFAULT_FIRST_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 25;
