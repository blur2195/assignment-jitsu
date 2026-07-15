import { SearchParams, ServiceResponse, Assignment } from "../store/models";
import { convertParamsToQueryString } from "../utils";
import axiosClient from "./axiosClient";

const apiUrl = "/assignments";
export const assignmentServices = {
  async getAll(params?: SearchParams): Promise<ServiceResponse<Assignment>> {
    const queryString = convertParamsToQueryString(params);
    const res = await axiosClient.get(`${apiUrl}?${queryString}`);
    return {
      data: res.data,
      total: res.headers["x-total-count"],
    };
  },

  async getById(id: string): Promise<Assignment> {
    const res = await axiosClient.get(`${apiUrl}/${id}`);
    return res.data;
  },

  async create(params: any): Promise<any> {
    const res = await axiosClient.post(`${apiUrl}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status;
  },

  async updateById(id: string, params: any): Promise<any> {
    const res = await axiosClient.patch(`${apiUrl}/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.status;
  },

  async deleteById(id: string): Promise<any> {
    const res = await axiosClient.delete(`${apiUrl}/${id}`);
    return res.status;
  },
}