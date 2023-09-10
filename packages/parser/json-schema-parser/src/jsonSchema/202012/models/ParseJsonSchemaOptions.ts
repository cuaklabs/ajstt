import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

import { UriOptions } from './UriOptions';

export interface ParseJsonSchemaOptions {
  schema: JsonRootSchema | JsonSchema;
  uriOptions: UriOptions;
}
