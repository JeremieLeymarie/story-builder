// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MigrateFunction = (...params: any[]) => Promise<void>;

export type Migration = {
  key: string;
  migrate: MigrateFunction;
};
