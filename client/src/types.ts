export type WithoutKey<T extends { key: string }> = Omit<T, "key">;
