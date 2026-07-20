export const convertParamsToQueryString = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.length && value.forEach(v => searchParams.append(key, v?.toString()));
    } else {
      if (value !== undefined && value !== null) searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}
