import { SHIPMENT_FILTER_TYPE, SHIPMENT_STATUS } from "config";

type ShipmentStatus = typeof SHIPMENT_STATUS[keyof typeof SHIPMENT_STATUS];
type ShipmentFilterType = typeof SHIPMENT_FILTER_TYPE[keyof typeof SHIPMENT_FILTER_TYPE];

export interface ShipmentFilter {
  status: ShipmentStatus | null;
  search: string | null;
  searchType: ShipmentFilterType;
  page: number;
  pageSize: number;
}

export interface Shipment {
  id: string;
  client_name: string;
  label: string;
  status: ShipmentStatus;
  arrival_date: string;
  delivery_by_date: string;
  eta: string;
  warehouse_id: string;
  assignment_id?: string;
  lat: number;
  lng: number;
}
