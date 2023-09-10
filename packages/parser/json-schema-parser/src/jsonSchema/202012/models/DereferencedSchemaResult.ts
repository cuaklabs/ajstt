import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

import { UriOptions } from '../models/UriOptions';

export interface DereferencedSchemaResult {
  schema: JsonRootSchema | JsonSchema;
  uriOptions: UriOptions;
}
