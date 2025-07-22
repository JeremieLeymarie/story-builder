import { db, TABLE_NAMES } from "../dexie/dexie-db";
import { SceneContentMigration } from "./scene-content-migration";
import { Migration } from "./types";

// The order is important here
export const MIGRATIONS: Migration[] = [SceneContentMigration];

const LS_KEY = "migrations";

export const executeMigrations = async () => {
  const executedMigrations: Record<string, boolean> = JSON.parse(
    localStorage.getItem(LS_KEY) ?? "{}",
  );

  db.transaction("rw", TABLE_NAMES, async () => {
    for (let i = 0; i < MIGRATIONS.length; i++) {
      const migration = MIGRATIONS[i]!;
      if (migration.key in executedMigrations) continue;

      await migration.migrate();
      executedMigrations[migration.key] = true;
      localStorage.setItem(LS_KEY, JSON.stringify(executedMigrations));
    }
  });
};
