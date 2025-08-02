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

  let count = 0;
  console.info("🎛️ Starting database migrations...");

  db.transaction("rw", TABLE_NAMES, async () => {
    for (let i = 0; i < MIGRATIONS.length; i++) {
      const migration = MIGRATIONS[i]!;
      if (migration.key in executedMigrations) continue;

      console.info(`🔧 Performing migration [${migration.key}]`);
      await migration.migrate();
      console.info(`🔧 Migration [${migration.key}] successfully executed`);
      count++;
      executedMigrations[migration.key] = true;
      localStorage.setItem(LS_KEY, JSON.stringify(executedMigrations));
    }
  });

  console.info(`✅ All ${count} migrations executed. Database is up-to-date.`);
};
