import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () =>
  yaml.load(
    readFileSync(resolve(__dirname, '../config', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
