import { LexicalCommand, createCommand } from "lexical";
import { ImagePayload } from "../../nodes/image-node";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");
