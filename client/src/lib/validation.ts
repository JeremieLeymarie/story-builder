import z from "zod";
import { HEX_COLOR_REGEX } from "./colors";

export const hexColorValidator = z.string().regex(HEX_COLOR_REGEX);
