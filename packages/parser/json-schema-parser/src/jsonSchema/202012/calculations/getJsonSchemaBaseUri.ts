import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';
import { getBaseUri } from '@cuaklabs/uri';

export interface GetJsonSchemaBaseUriOptions {
  encapsulatingDocumentBaseUri?: string | undefined;
  retrievalUri?: string | undefined;
}

export function getJsonSchemaBaseUri(
  schema: JsonSchema,
  options?: GetJsonSchemaBaseUriOptions,
): string {
  const documentBaseUri: string | undefined =
    typeof schema === 'boolean' ? undefined : schema.$id;

  return getBaseUri({
    ...(options ?? {}),
    documentBaseUri,
  });
}
