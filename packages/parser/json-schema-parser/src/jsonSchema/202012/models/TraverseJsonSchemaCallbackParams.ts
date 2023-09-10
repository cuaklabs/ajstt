import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

export interface TraverseJsonSchemaCallbackParams {
  jsonPointer: string;
  parentJsonPointer: string | undefined;
  parentSchema: JsonRootSchema | JsonSchema | undefined;
  schema: JsonRootSchema | JsonSchema;
}
