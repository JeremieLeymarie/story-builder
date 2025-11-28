import z from "zod";

export const USER_SETTINGS_KEY = "user-settings";
export const userSettingsSchema = z
  .object({
    builder: z.object({ toolbarExpanded: z.boolean().default(true) }),
  })
  .catch({ builder: { toolbarExpanded: true } });
