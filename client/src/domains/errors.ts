import { Entity } from "@/lib/storage/domain";

export class EntityNotExistError extends Error {
  constructor(entityType: Entity, key: string) {
    super(`Entity [${entityType}] with key {${key}} does not exist.`);
  }
}
