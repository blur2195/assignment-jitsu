export const ASSIGNMENT_STATUS = {
  OPEN: "OPEN",
  COMPLETED: "COMPLETED",
} as const;

export const SHIPMENT_STATUS = {
  OPEN: "OPEN",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
} as const;

export const SHIPMENT_FILTER_TYPE = {
  LABEL: "label",
  CLIENT_NAME: "client_name",
} as const;

export const DEFAULT_FIRST_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 25;