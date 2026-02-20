import { Entity } from "@/lib/storage/domain";

export class EntityNotExistError extends Error {
  constructor(entityType: Entity, key: string | Record<string, string>) {
    const keys = typeof key === "string" ? { key } : key;
    super(
      `Entity [${entityType}] does not exist. Tried to get entity with keys : ${JSON.stringify(keys)}`,
    );
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden operation.");
  }
}
