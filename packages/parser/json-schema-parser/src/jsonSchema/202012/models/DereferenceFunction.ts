import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';

export type DereferenceFunction = (
  schema: JsonSchema,
  baseUri: string,
  uri: string,
) => Promise<JsonSchema>;
