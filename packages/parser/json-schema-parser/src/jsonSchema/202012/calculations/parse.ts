import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

import { DereferenceFunction } from '../models/DereferenceFunction';
import { JsonSchemaParseResult } from '../models/JsonSchemaParseResult';
import { ParseJsonSchemaOptions } from '../models/ParseJsonSchemaOptions';
import { UriOptions } from '../models/UriOptions';
import { dereferenceJsonSchema } from './dereferenceJsonSchema';

export async function parse(
  deref: DereferenceFunction,
  schemas: (JsonRootSchema | JsonSchema)[],
  options: UriOptions,
): Promise<JsonSchemaParseResult>;
export async function parse(
  deref: DereferenceFunction,
  options: ParseJsonSchemaOptions[],
): Promise<JsonSchemaParseResult>;
export async function parse(
  ...args:
    | [DereferenceFunction, (JsonRootSchema | JsonSchema)[], UriOptions]
    | [DereferenceFunction, ParseJsonSchemaOptions[]]
): Promise<JsonSchemaParseResult> {
  const [deref, schemasOrOptions, optionsOrUndefined]:
    | [DereferenceFunction, (JsonRootSchema | JsonSchema)[], UriOptions]
    | [DereferenceFunction, ParseJsonSchemaOptions[], undefined] = args as
    | [DereferenceFunction, (JsonRootSchema | JsonSchema)[], UriOptions]
    | [DereferenceFunction, ParseJsonSchemaOptions[], undefined];

  if (optionsOrUndefined === undefined) {
    return parseFromMultipleOptions(deref, schemasOrOptions);
  } else {
    return parseFromSingleOptions(deref, schemasOrOptions, optionsOrUndefined);
  }
}

async function parseFromSingleOptions(
  deref: DereferenceFunction,
  schemas: (JsonRootSchema | JsonSchema)[],
  options: UriOptions,
): Promise<JsonSchemaParseResult> {
  const referenceMap: Map<string, JsonRootSchema | JsonSchema> = new Map();

  await Promise.all(
    schemas.map(
      async (schema: JsonRootSchema | JsonSchema): Promise<void> =>
        dereferenceJsonSchema(deref, schema, referenceMap, options),
    ),
  );

  return {
    referenceMap,
    schemas,
  };
}

async function parseFromMultipleOptions(
  deref: DereferenceFunction,
  options: ParseJsonSchemaOptions[],
): Promise<JsonSchemaParseResult> {
  const referenceMap: Map<string, JsonRootSchema | JsonSchema> = new Map();

  await Promise.all(
    options.map(
      async (schemaOptions: ParseJsonSchemaOptions): Promise<void> =>
        dereferenceJsonSchema(
          deref,
          schemaOptions.schema,
          referenceMap,
          schemaOptions.uriOptions,
        ),
    ),
  );

  return {
    referenceMap,
    schemas: options.map(
      (schemaOptions: ParseJsonSchemaOptions) => schemaOptions.schema,
    ),
  };
}
