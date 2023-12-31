import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

export interface TraverseJsonSchemaParams {
  jsonPointer?: string;
  schema: JsonRootSchema | JsonSchema;
}
