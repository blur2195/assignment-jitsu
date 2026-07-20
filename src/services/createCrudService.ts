import { SearchParams, ServiceResponse } from "types";
import { convertParamsToQueryString } from "utils";
import axiosClient from "./axiosClient";

export const createCrudService = <T>(apiUrl: string) => ({
  async getAll(params?: SearchParams): Promise<ServiceResponse<T>> {
    const queryString = convertParamsToQueryString(params);
    const res = await axiosClient.get(`${apiUrl}?${queryString}`);
    return {
      data: res.data,
      total: res.headers["x-total-count"],
    };
  },

  async getById(id: string): Promise<T> {
    const res = await axiosClient.get(`${apiUrl}/${id}`);
    return res.data;
  },

  async create(params: unknown): Promise<number> {
    const res = await axiosClient.post(apiUrl, params);
    return res.status;
  },

  async updateById(id: string, params: unknown): Promise<number> {
    const res = await axiosClient.patch(`${apiUrl}/${id}`, params);
    return res.status;
  },

  async deleteById(id: string): Promise<number> {
    const res = await axiosClient.delete(`${apiUrl}/${id}`);
    return res.status;
  },
});
