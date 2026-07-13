export interface SearchParams {
  [k: string]: unknown,
}

export interface ServiceResponse<T> {
  total: number,
  data: T[],
}