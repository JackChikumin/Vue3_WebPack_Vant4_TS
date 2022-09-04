import pkg from '../../package.json';
import type { GlobEnvConfig } from '#/config';
import { getConfigFileName } from '@/utils/getConfigFileName';

export function getCommonStoragePrefix() {
  const { VUE_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VUE_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(process.env);

  const ENV = (Object.is(process.env.NODE_ENV, 'development')
    ? // Get the global configuration (the configuration will be extracted independently when packaging)
      (process.env as unknown as GlobEnvConfig)
    : window[ENV_NAME as any]) as unknown as GlobEnvConfig;
  const {
    VUE_APP_TITLE,
    VUE_APP_API_URL,
    VUE_APP_SHORT_NAME,
    VUE_APP_API_URL_PREFIX,
    VUE_APP_UPLOAD_URL,
    VUE_APP_ENCRYPT,
    VUE_APP_PUBLICKEY,
  } = ENV;

  return {
    VUE_APP_TITLE,
    VUE_APP_API_URL,
    VUE_APP_SHORT_NAME,
    VUE_APP_API_URL_PREFIX,
    VUE_APP_UPLOAD_URL,
    VUE_APP_ENCRYPT,
    VUE_APP_PUBLICKEY,
  };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return process.env;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return Object.is(process.env, 'development');
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return Object.is(process.env, 'production');
}
