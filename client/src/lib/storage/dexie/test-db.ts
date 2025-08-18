import Dexie from "dexie";
import { createDb, Database } from "./dexie-db";
import { IDBKeyRange, IDBFactory } from "fake-indexeddb";
import { User } from "../domain";

export const TEST_USER: User = {
  email: "test@gmail.com",
  username: "test-user",
  key: "test-user-key",
};

export const getTestDatabase = async () => {
  const indexedDB = new IDBFactory();
  const testDB = new Dexie("test-sb", {
    indexedDB,
    IDBKeyRange,
  }) as Database;

  createDb(testDB);
  await testDB.user.add(TEST_USER);

  return testDB;
};
