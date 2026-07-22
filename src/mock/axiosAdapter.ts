import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { applyQuery } from "./query";
import {
  createItem,
  deleteItem,
  ensureDbReady,
  findById,
  getCollection,
  MockCollection,
  updateItem,
} from "./store";

const COLLECTIONS = new Set<MockCollection>(["shipments", "assignments", "statuses"]);

const parseBody = (data: unknown) => {
  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return data;
};

const parsePath = (url: string) => {
  const [path, queryString = ""] = url.split("?");
  const query = Object.fromEntries(new URLSearchParams(queryString));
  const segments = path.replace(/^\//, "").split("/").filter(Boolean);
  const collection = segments[0] as MockCollection;
  const id = segments[1];

  return {
    collection: COLLECTIONS.has(collection) ? collection : undefined,
    id,
    query,
  };
};

const buildResponse = (
  config: InternalAxiosRequestConfig,
  data: unknown,
  status: number,
  headers: Record<string, string> = {},
) => ({
  data,
  status,
  statusText: status >= 200 && status < 300 ? "OK" : "Error",
  headers,
  config,
  request: {},
});

export const mockAxiosAdapter: AxiosAdapter = async (config) => {
  await ensureDbReady();

  const url = config.url ?? "";
  const method = (config.method ?? "get").toLowerCase();
  const { collection, id, query } = parsePath(url);

  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query[key] = String(value);
      }
    });
  }

  if (!collection) {
    return buildResponse(config, {}, 404);
  }

  switch (method) {
    case "get": {
      if (id) {
        const item = findById(getCollection(collection), id);

        return item
          ? buildResponse(config, item, 200)
          : buildResponse(config, {}, 404);
      }

      const { data, total } = applyQuery(getCollection(collection), query);

      return buildResponse(config, data, 200, {
        "x-total-count": String(total),
      });
    }
    case "post": {
      const created = createItem(collection, parseBody(config.data));
      return buildResponse(config, created, 201);
    }
    case "patch": {
      const updated = updateItem(collection, id ?? "", parseBody(config.data));

      return updated
        ? buildResponse(config, updated, 200)
        : buildResponse(config, {}, 404);
    }
    case "delete": {
      const deleted = deleteItem(collection, id ?? "");
      return buildResponse(config, {}, deleted ? 200 : 404);
    }
    default:
      return buildResponse(config, {}, 405);
  }
};
