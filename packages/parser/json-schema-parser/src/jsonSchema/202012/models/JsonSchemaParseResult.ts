import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';

export interface JsonSchemaParseResult {
  schemas: JsonSchema[];
  referenceMap: Map<string, JsonSchema>;
}
