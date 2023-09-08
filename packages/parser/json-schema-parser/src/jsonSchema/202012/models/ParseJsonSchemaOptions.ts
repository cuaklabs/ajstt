import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';

import { UriOptions } from './UriOptions';

export interface ParseJsonSchemaOptions {
  schema: JsonSchema;
  uriOptions: UriOptions;
}
