import { config } from '@config';

export type TConfig = typeof config;
export type TConfigKeys = keyof TConfig;
