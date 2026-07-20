import { Shipment } from "types";
import axiosClient from "./axiosClient";
import { createCrudService } from "./createCrudService";

const apiUrl = "/shipments";
const crudService = createCrudService<Shipment>(apiUrl);

export const shipmentServices = {
  ...crudService,

  async getByAssignmentId(id: string): Promise<Shipment[]> {
    const res = await axiosClient.get(`${apiUrl}?assignment_id=${id}`);
    return res.data;
  },
};
