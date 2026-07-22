import { SearchParams } from "types";

export const applyQuery = <T extends object>(
  items: T[],
  params?: SearchParams,
): { data: T[]; total: number } => {
  let result = [...items];
  const query = params ?? {};

  const page = query._page ? Number(query._page) : null;
  const limit = query._limit ? Number(query._limit) : null;

  const filters = { ...query };
  delete filters._page;
  delete filters._limit;
  delete filters._sort;
  delete filters._order;
  delete filters._start;
  delete filters._end;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (key.endsWith("_like")) {
      const field = key.slice(0, -5);
      const search = String(value).toLowerCase();
      result = result.filter((item) =>
        String((item as Record<string, unknown>)[field] ?? "").toLowerCase().includes(search),
      );
      continue;
    }

    result = result.filter(
      (item) => String((item as Record<string, unknown>)[key]) === String(value),
    );
  }

  const total = result.length;

  if (page && limit) {
    const start = (page - 1) * limit;
    result = result.slice(start, start + limit);
  } else if (query._start !== undefined || query._end !== undefined) {
    const start = query._start ? Number(query._start) : 0;
    const end = query._end ? Number(query._end) : result.length;
    result = result.slice(start, end);
  }

  return { data: result, total };
};
