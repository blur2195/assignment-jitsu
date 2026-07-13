export const convertParamsToQueryString = (params?: any) => {
  if (params === null) return "";
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