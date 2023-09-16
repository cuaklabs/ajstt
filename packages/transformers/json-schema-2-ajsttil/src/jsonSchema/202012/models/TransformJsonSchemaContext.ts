import { TypeMedatata } from '@cuaklabs/ajsttil';
import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

export interface TransformJsonSchemaContext {
  jsonSchemaToTypeMap: Map<JsonRootSchema | JsonSchema, TypeMedatata>;
  referenceMap: Map<string, JsonRootSchema | JsonSchema>;
}
