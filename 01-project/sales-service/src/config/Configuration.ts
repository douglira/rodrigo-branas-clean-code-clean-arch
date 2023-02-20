import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = '.config.development.yaml';

export interface DatabaseConfig {
  postgres: {
    url: string;
    port: number;
    database: string;
    auth_user: string;
    auth_pswd: string;
    pool: {
      max: number;
      idle_timeout_millis: number;
      connection_timeout_millis: number;
    };
  };
}

export interface GoogleAPIConfig {
  api_key: string;
}

export default () => {
  const path = join(__dirname, '..', '.env', YAML_CONFIG_FILENAME);
  return yaml.load(readFileSync(path, 'utf8')) as Record<string, any>;
};
