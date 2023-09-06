import {
  JsonRootSchemaObject,
  JsonSchema,
  JsonRootSchemaKnownPropertiesObject,
} from '@cuaklabs/json-schema-types/2020-12';

import { TraverseJsonSchemaCallbackParams } from '../models/TraverseJsonSchemaCallbackParams';
import { TraverseJsonSchemaParams } from '../models/TraverseJsonSchemaParams';

type JsonRootSchemaSchemaProperty =
  | JsonSchema
  | JsonSchema[]
  | Record<string, JsonRootSchemaObject>;

type JsonRootSchemaSchemaPropertyHandler = (
  params: TraverseJsonSchemaCallbackParams,
  childSchema: JsonRootSchemaSchemaProperty,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
) => void;

const jsonRootSchemaObjectPropertyToHandlerMap: {
  [TKey in keyof JsonRootSchemaKnownPropertiesObject]?: (
    params: TraverseJsonSchemaCallbackParams,
    childSchema: Exclude<JsonRootSchemaObject[TKey], undefined>,
    key: string,
    callback: (params: TraverseJsonSchemaCallbackParams) => void,
  ) => void;
} = {
  $defs: traverseDirectChildSchemaMap,
  additionalProperties: traverseDirectChildSchema,
  allOf: traverseDirectChildSchemaArray,
  anyOf: traverseDirectChildSchemaArray,
  contains: traverseDirectChildSchema,
  dependentSchemas: traverseDirectChildSchemaMap,
  else: traverseDirectChildSchema,
  if: traverseDirectChildSchema,
  items: traverseDirectChildSchema,
  not: traverseDirectChildSchema,
  oneOf: traverseDirectChildSchemaArray,
  patternProperties: traverseDirectChildSchemaMap,
  prefixItems: traverseDirectChildSchemaArray,
  properties: traverseDirectChildSchemaMap,
  propertyNames: traverseDirectChildSchema,
  then: traverseDirectChildSchema,
  unevaluatedItems: traverseDirectChildSchema,
  unevaluatedProperties: traverseDirectChildSchema,
};

export function traverseJsonSchema(
  params: TraverseJsonSchemaParams,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  traverseJsonSchemaFromParams(
    {
      jsonPointer: params.jsonPointer ?? '',
      parentJsonPointer: undefined,
      parentSchema: undefined,
      schema: params.schema,
    },
    callback,
  );
}

function traverseJsonSchemaFromParams(
  params: TraverseJsonSchemaCallbackParams,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  callback(params);

  if (params.schema !== true && params.schema !== false) {
    for (const key of Object.keys(params.schema)) {
      const handler: JsonRootSchemaSchemaPropertyHandler | undefined =
        jsonRootSchemaObjectPropertyToHandlerMap[
          key as keyof JsonRootSchemaKnownPropertiesObject
        ] as JsonRootSchemaSchemaPropertyHandler | undefined;

      if (handler !== undefined) {
        handler(
          params,
          params.schema[key] as JsonRootSchemaSchemaProperty,
          key,
          callback,
        );
      }
    }
  }
}

function traverseDirectChildSchema(
  params: TraverseJsonSchemaCallbackParams,
  childSchema: JsonSchema,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams = {
    jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}`,
    parentJsonPointer: params.jsonPointer,
    parentSchema: params.schema,
    schema: childSchema,
  };

  traverseJsonSchemaFromParams(traverseChildSchemaCallbackParams, callback);
}

function traverseDirectChildSchemaArray(
  params: TraverseJsonSchemaCallbackParams,
  childSchemas: JsonSchema[],
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  for (const [index, schema] of childSchemas.entries()) {
    const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
      {
        jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}/${index}`,
        parentJsonPointer: params.jsonPointer,
        parentSchema: params.schema,
        schema,
      };

    traverseJsonSchemaFromParams(traverseChildSchemaCallbackParams, callback);
  }
}

function traverseDirectChildSchemaMap(
  params: TraverseJsonSchemaCallbackParams,
  schemasMap: Record<string, JsonSchema>,
  key: string,
  callback: (params: TraverseJsonSchemaCallbackParams) => void,
): void {
  for (const [mapKey, schema] of Object.entries(schemasMap)) {
    const traverseChildSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
      {
        jsonPointer: `${params.jsonPointer}/${escapeJsonPtr(key)}/${mapKey}`,
        parentJsonPointer: params.jsonPointer,
        parentSchema: params.schema,
        schema,
      };

    traverseJsonSchemaFromParams(traverseChildSchemaCallbackParams, callback);
  }
}

function escapeJsonPtr(str: string): string {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}
