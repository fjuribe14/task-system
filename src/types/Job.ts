export type TJob = {
  name: string;
  cron: string;
  execute(): Promise<void>;
};
