import {
  JsonRootSchema,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';
import { getBaseUri } from '@cuaklabs/uri';

import { UriOptions } from '../models/UriOptions';

export function getJsonSchemaBaseUri(
  schema: JsonRootSchema | JsonSchema,
  options?: UriOptions,
): string {
  const documentBaseUri: string | undefined =
    typeof schema === 'boolean' ? undefined : schema.$id;

  return getBaseUri({
    ...(options ?? {}),
    documentBaseUri,
  });
}
