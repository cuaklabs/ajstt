import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';
import { Uri } from '@cuaklabs/uri';

import { traverseJsonSchema } from '../actions/traverseJsonSchema';
import { DereferencedSchemaResult } from '../models/DereferencedSchemaResult';
import { DereferenceFunction } from '../models/DereferenceFunction';
import { TraverseJsonSchemaCallbackParams } from '../models/TraverseJsonSchemaCallbackParams';
import { UriOptions } from '../models/UriOptions';
import { getJsonSchemaBaseUri } from './getJsonSchemaBaseUri';

export async function dereferenceJsonSchema(
  deref: DereferenceFunction,
  schema: JsonRootSchema | JsonSchema,
  referenceMap: Map<string, JsonRootSchema | JsonSchema>,
  uriOptions: UriOptions | undefined,
): Promise<void> {
  const baseUri: string = getJsonSchemaBaseUri(schema, uriOptions);

  const schemaUris: string[] = [...new Set(getSchemaUris(schema, baseUri))];

  const missingSchemaUris: string[] = schemaUris.filter(
    (schemaUri: string) => !referenceMap.has(schemaUri),
  );

  await Promise.all(
    missingSchemaUris.map(async (schemaUri: string): Promise<void> => {
      const dereferencedSchemaResult: DereferencedSchemaResult = await deref(
        schema,
        baseUri,
        schemaUri,
      );

      referenceMap.set(schemaUri, dereferencedSchemaResult.schema);

      await dereferenceJsonSchema(
        deref,
        dereferencedSchemaResult.schema,
        referenceMap,
        dereferencedSchemaResult.uriOptions,
      );
    }),
  );
}

function getSchemaUris(
  schema: JsonRootSchema | JsonSchema,
  baseUri: string,
): string[] {
  const schemaUris: string[] = [];

  traverseJsonSchema(
    {
      schema,
    },
    (params: TraverseJsonSchemaCallbackParams): void => {
      if (
        typeof params.schema !== 'boolean' &&
        params.schema.$ref !== undefined
      ) {
        const refUri: string = new Uri(params.schema.$ref, baseUri).toString();

        schemaUris.push(refUri);
      }
    },
  );

  return schemaUris;
}
