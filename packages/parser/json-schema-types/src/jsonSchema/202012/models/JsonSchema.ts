import { JsonValue } from '../../../json/models/JsonValue';

export type NonEmptyArray<T> = [T, ...T[]];

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-boolean-json-schemas
export type JsonSchemaBoolean = boolean;

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-the-json-schema-core-vocabu
export interface JsonSchemaCoreVocabularyProperties {
  $anchor?: string;
  $comments?: string;
  $defs?: Record<string, JsonSchema>;
  $dynamicAnchor?: string;
  $dynamicRef?: string;
  $id?: string;
  $ref?: string;
}

// eslint-disable-next-line @typescript-eslint/typedef
export const wellKnownVocabularies = {
  applicator: 'https://json-schema.org/draft/2020-12/vocab/applicator',
  content: 'https://json-schema.org/draft/2020-12/vocab/content',
  core: 'https://json-schema.org/draft/2020-12/vocab/core',
  formatAnnotation:
    'https://json-schema.org/draft/2020-12/vocab/format-annotation',
  formatAssertion:
    'https://json-schema.org/draft/2020-12/vocab/format-assertion',
  metadata: 'https://json-schema.org/draft/2020-12/vocab/meta-data',
  unevaluatedApplicator:
    'https://json-schema.org/draft/2020-12/vocab/unevaluated',
  validation: 'https://json-schema.org/draft/2020-12/vocab/validation',
} as const satisfies Record<string, string>;

export type WellKnownVocabulary =
  (typeof wellKnownVocabularies)[keyof typeof wellKnownVocabularies];

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-the-json-schema-core-vocabu
export interface JsonRootSchemaCoreVocabularyProperties {
  $schema: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  $vocabulary?: Record<WellKnownVocabulary | string, boolean>;
}

// https://json-schema.org/draft/2020-12/json-schema-core.html#section-4.3.1-6
export interface JsonSchemaUnknownProperties {
  [key: string]: JsonValue;
}

export type JsonSchemaKnownPropertiesObject =
  JsonSchemaCoreVocabularyProperties &
    JsonSchemaSubschemeAppliedProperties &
    JsonSchemaUnevaluatedLocationProperties &
    JsonSchemaStructuralValidationProperties &
    JsonSchemaFormatProperties &
    JsonSchemaStringContentEncodedProperties &
    JsonSchemaMetadataAnnotationsProperties;

export type JsonSchemaObject = JsonSchemaKnownPropertiesObject &
  JsonSchemaUnknownProperties;

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-a-vocabulary-for-applying-s
export interface JsonSchemaSubschemeAppliedProperties {
  additionalProperties?: JsonSchema;
  allOf?: NonEmptyArray<JsonSchema>;
  anyOf?: NonEmptyArray<JsonSchema>;
  contains?: JsonSchema;
  dependentSchemas?: Record<string, JsonSchema>;
  else?: JsonSchema;
  if?: JsonSchema;
  items?: JsonSchema;
  not?: JsonSchema;
  oneOf?: NonEmptyArray<JsonSchema>;
  patternProperties?: Record<string, JsonSchema>;
  prefixItems?: NonEmptyArray<JsonSchema>;
  propertyNames?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  then?: JsonSchema;
}

// https://json-schema.org/draft/2020-12/json-schema-core.html#name-a-vocabulary-for-unevaluate
export interface JsonSchemaUnevaluatedLocationProperties {
  unevaluatedItems?: JsonSchema;
  unevaluatedProperties?: JsonSchema;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-structural
export interface JsonSchemaStructuralValidationProperties {
  const?: JsonValue;
  dependentRequired?: Record<string, string[]>;
  enum?: NonEmptyArray<JsonValue>;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  maxContains?: number;
  maximum?: number;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  minContains?: number;
  minimum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  multipleOf?: number;
  pattern?: string;
  required?: string[];
  type?: JsonSchemaType | JsonSchemaType[];
  uniqueItems?: boolean;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-validation-keywords-for-any

// eslint-disable-next-line @typescript-eslint/typedef
export const jsonSchemaTypes = {
  array: 'array',
  boolean: 'boolean',
  integer: 'integer',
  null: 'null',
  number: 'number',
  object: 'object',
  string: 'string',
} as const satisfies Record<string, string>;

export type JsonSchemaType =
  (typeof jsonSchemaTypes)[keyof typeof jsonSchemaTypes];

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-vocabularies-for-semantic-c
export interface JsonSchemaFormatProperties {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  format?: JsonSchemaCustomFormat | JsonSchemaFormat;
}

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-custom-format-attributes
export type JsonSchemaCustomFormat = string;

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-defined-formats
// eslint-disable-next-line @typescript-eslint/typedef
export const jsonSchemaFormats = {
  date: 'date',
  dateTime: 'date-time',
  duration: 'duration',
  email: 'email',
  hostname: 'hostname',
  idnEmail: 'idn-email',
  idnHostname: 'idn-hostname',
  ipV4: 'ipv4',
  ipV6: 'ipv6',
  iri: 'iri',
  iriReference: 'iri-reference',
  jsonPointer: 'json-pointer',
  regex: 'regex',
  relativeJsonPointer: 'relative-json-pointer',
  time: 'time',
  uri: 'uri',
  uriReference: 'uri-reference',
  uriTemplate: 'uri-template',
  uuid: 'uuid',
} as const satisfies Record<string, string>;

export type JsonSchemaFormat =
  (typeof jsonSchemaFormats)[keyof typeof jsonSchemaFormats];

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-the-conten
export interface JsonSchemaStringContentEncodedProperties {
  contentEncoding?:
    | JsonSchemaBaseContentEncoding
    | JsonSchemaMimeContentTransferEncoding;
  contentMediaType?: string;
  contentSchema?: JsonSchema;
}

/*
 * https://json-schema.org/draft/2020-12/json-schema-validation.html#name-contentencoding
 * - https://www.rfc-editor.org/rfc/rfc4648.html
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const jsonSchemaBaseContentEncodings = {
  base32: 'base32',
  base32hex: 'base32hex',
  base64: 'base64',
  base64url: 'base64url',
  hex: 'hex',
} as const satisfies Record<string, string>;

export type JsonSchemaBaseContentEncoding =
  (typeof jsonSchemaBaseContentEncodings)[keyof typeof jsonSchemaBaseContentEncodings];

// eslint-disable-next-line @typescript-eslint/typedef
export const jsonSchemaMimeContentTransferEncodings = {
  base64: 'base64',
  binary: 'binary',
  bit7: '7bit',
  bit8: '8bit',
  ietfToken: 'ietf-token',
  quotedPrintable: 'quoted-printable',
  xToken: 'x-token',
} as const satisfies Record<string, string>;

export type JsonSchemaMimeContentTransferEncoding =
  (typeof jsonSchemaMimeContentTransferEncodings)[keyof typeof jsonSchemaMimeContentTransferEncodings];

// https://json-schema.org/draft/2020-12/json-schema-validation.html#name-a-vocabulary-for-basic-meta
export interface JsonSchemaMetadataAnnotationsProperties {
  default?: JsonValue;
  deprecated?: boolean;
  description?: string;
  examples?: JsonValue[];
  readOnly?: boolean;
  title?: string;
  writeOnly?: boolean;
}

export type JsonRootSchemaKnownPropertiesObject =
  JsonSchemaKnownPropertiesObject & JsonRootSchemaCoreVocabularyProperties;

export type JsonRootSchemaObject = JsonRootSchemaKnownPropertiesObject &
  JsonSchemaUnknownProperties;

export type JsonSchema = JsonSchemaBoolean | JsonSchemaObject;

export type JsonRootSchema = JsonSchemaBoolean | JsonRootSchemaObject;
