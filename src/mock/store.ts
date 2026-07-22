import seedData from "../mockData/shipments.json";
import { Assignment, Shipment } from "types";

export type MockCollection = "shipments" | "assignments" | "statuses";

export interface MockDb {
  shipments: Shipment[];
  assignments: Assignment[];
  statuses: { id: string }[];
}

const cloneDb = (data: MockDb): MockDb => ({
  shipments: data.shipments.map((item) => ({ ...item })),
  assignments: data.assignments.map((item) => ({ ...item })),
  statuses: data.statuses.map((item) => ({ ...item })),
});

let db: MockDb = cloneDb(seedData as MockDb);

const loadDb = async (): Promise<MockDb> => {
  if (process.env.NODE_ENV === "development") {
    const res = await fetch("/mock/db");

    if (!res.ok) {
      throw new Error("Failed to load mock db");
    }

    return cloneDb(await res.json());
  }

  return cloneDb(seedData as MockDb);
};

const persistDb = () => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  fetch("/mock/persist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(db),
  }).catch((error) => {
    console.error("Failed to persist mock db", error);
  });
};

export const mockDbReady = loadDb().then((data) => {
  db = data;
});

export const ensureDbReady = async () => {
  await mockDbReady;
  return db;
};

export const generateId = () => Math.random().toString(36).slice(2, 9);

export const getCollection = <K extends MockCollection>(name: K): MockDb[K] =>
  db[name];

export const findById = <T extends { id: string }>(
  collection: T[],
  id: string,
): T | undefined => collection.find((item) => item.id === id);

export const createItem = <K extends MockCollection>(
  collection: K,
  item: MockDb[K][number],
): MockDb[K][number] => {
  const record = {
    ...item,
    id: item.id || generateId(),
  } as MockDb[K][number];

  db = {
    ...db,
    [collection]: [...db[collection], record],
  };

  persistDb();
  return record;
};

export const updateItem = <K extends MockCollection>(
  collection: K,
  id: string,
  updates: Partial<MockDb[K][number]>,
): MockDb[K][number] | undefined => {
  const items = db[collection];
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  const updated = { ...items[index], ...updates } as MockDb[K][number];
  db = {
    ...db,
    [collection]: [
      ...items.slice(0, index),
      updated,
      ...items.slice(index + 1),
    ],
  };

  persistDb();
  return updated;
};

export const deleteItem = (collection: MockCollection, id: string): boolean => {
  const items = db[collection];
  const nextItems = items.filter((item) => item.id !== id);

  if (nextItems.length === items.length) {
    return false;
  }

  db = {
    ...db,
    [collection]: nextItems,
  };

  persistDb();
  return true;
};

export const resetMockDb = () => {
  db = cloneDb(seedData as MockDb);
  persistDb();
};
