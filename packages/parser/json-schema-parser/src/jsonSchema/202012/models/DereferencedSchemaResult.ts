import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';

import { UriOptions } from '..';

export interface DereferencedSchemaResult {
  schema: JsonSchema;
  uriOptions: UriOptions;
}
