import { TypeMedatata, TypeMetadataKind } from '@cuaklabs/ajsttil';
import { JsonValue } from '@cuaklabs/json-schema-types';
import {
  JsonRootSchema,
  JsonSchema,
  JsonSchemaBoolean,
  JsonSchemaObject,
  JsonSchemaType,
  jsonSchemaTypes,
} from '@cuaklabs/json-schema-types/2020-12';

import { TransformJsonSchemaContext } from '../models/TransformJsonSchemaContext';

export function transformJsonSchema(
  schema: JsonRootSchema | JsonSchema,
  context: TransformJsonSchemaContext,
): TypeMedatata {
  if (typeof schema === 'boolean') {
    return transformBooleanJsonSchema(schema);
  } else {
    return transformObjectJsonSchema(schema, context);
  }
}

function buildTypeMetadata(
  id: string | undefined,
  typeMetadataPartial: Partial<TypeMedatata>,
  typeConstraints: TypeMedatata[],
): TypeMedatata {
  if (id !== undefined) {
    typeMetadataPartial.id = id;
  }

  let typeMetadata: TypeMedatata;

  if (typeConstraints.length === 0) {
    typeMetadata = {
      kind: TypeMetadataKind.anyType,
    };
  } else {
    if (typeConstraints.length === 1) {
      const childType: Partial<TypeMedatata> | TypeMedatata =
        typeConstraints[0] as TypeMedatata;

      if (childType.kind === undefined) {
        /*
         * Tricky edge case in which a circular reference is found.
         * Any is returned as no constraints were found so far.
         */
        typeMetadata = {
          kind: TypeMetadataKind.anyType,
        };
      } else {
        typeMetadata = childType as TypeMedatata;
      }
    } else {
      typeMetadata = {
        children: typeConstraints,
        kind: TypeMetadataKind.and,
      };
    }
  }

  const typeMetadataResult: TypeMedatata = Object.assign<
    Partial<TypeMedatata>,
    TypeMedatata
  >(typeMetadataPartial, typeMetadata);

  return typeMetadataResult;
}

function handleApplicatorVocabularyProperties(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  handleJsonSchemaChildren(schema, context, typeConstraints);
  handleJsonSchemaProperties(schema, context, typeConstraints);
  handleJsonSchemaSubschemas(schema, context, typeConstraints);
}

function handleCoreVocabularyProperties(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  handleJsonSchemaRef(schema, context, typeConstraints);
}

function handleJsonSchemaChildren(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  if (schema.items !== undefined) {
    typeConstraints.push({
      children: [
        {
          child: transformJsonSchema(schema.items, context),
          kind: TypeMetadataKind.arrayType,
        },
        {
          kind: TypeMetadataKind.floatType,
        },
        {
          kind: TypeMetadataKind.objectType,
        },
        {
          kind: TypeMetadataKind.stringType,
        },
      ],
      kind: TypeMetadataKind.or,
    });
  }
}

function handleJsonSchemaAdditionalProperties(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  if (schema.additionalProperties !== undefined) {
    typeConstraints.push({
      child: transformJsonSchema(schema.additionalProperties, context),
      kind: TypeMetadataKind.stringIndexSignatureType,
    });
  }
}

function handleJsonSchemaProperties(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  handleJsonSchemaAdditionalProperties(schema, context, typeConstraints);

  if (schema.properties !== undefined) {
    for (const propertyName in schema.properties) {
      const propertySchema: JsonSchema = schema.properties[
        propertyName
      ] as JsonSchema;

      const isOptional: boolean = isPropertyOptional(schema, propertyName);

      typeConstraints.push({
        child: transformJsonSchema(propertySchema, context),
        isOptional,
        kind: TypeMetadataKind.propertyType,
        property: propertyName,
      });
    }
  }
}

function handleJsonSchemaRef(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  if (schema.$ref !== undefined) {
    const dereferencedSchema: JsonSchema | undefined = context.referenceMap.get(
      schema.$ref,
    );

    if (dereferencedSchema === undefined) {
      throw new Error(`Unable to resolve "${schema.$ref}" $ref`);
    }

    typeConstraints.push(transformJsonSchema(dereferencedSchema, context));
  }
}

function handleJsonSchemaSubschemas(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
  typeConstraints: TypeMedatata[],
): void {
  if (schema.allOf !== undefined) {
    typeConstraints.push({
      children: schema.allOf.map((schema: JsonSchema) =>
        transformJsonSchema(schema, context),
      ),
      kind: TypeMetadataKind.and,
    });
  }

  if (schema.anyOf !== undefined) {
    typeConstraints.push({
      children: schema.anyOf.map((schema: JsonSchema) =>
        transformJsonSchema(schema, context),
      ),
      kind: TypeMetadataKind.or,
    });
  }

  if (schema.oneOf !== undefined) {
    typeConstraints.push({
      children: schema.oneOf.map((schema: JsonSchema) =>
        transformJsonSchema(schema, context),
      ),
      kind: TypeMetadataKind.xor,
    });
  }
}

function handleValidationVocabularyProperties(
  schema: JsonSchemaObject,
  typeConstraints: TypeMedatata[],
): void {
  if (schema.const !== undefined) {
    typeConstraints.push({
      kind: TypeMetadataKind.literalType,
      literal: schema.const,
    });
  }

  if (schema.enum !== undefined) {
    typeConstraints.push({
      children: schema.enum.map((enumValue: JsonValue) => ({
        kind: TypeMetadataKind.literalType,
        literal: enumValue,
      })),
      kind: TypeMetadataKind.or,
    });
  }

  if (schema.type !== undefined) {
    if (Array.isArray(schema.type)) {
      typeConstraints.push({
        children: schema.type.map((schemaType: JsonSchemaType) =>
          transformJsonSchemaType(schemaType),
        ),
        kind: TypeMetadataKind.or,
      });
    } else {
      typeConstraints.push(transformJsonSchemaType(schema.type));
    }
  }
}

function isPropertyOptional(
  schema: JsonSchemaObject,
  propertyName: string,
): boolean {
  return !(schema.required?.includes(propertyName) ?? false);
}

function transformBooleanJsonSchema(schema: JsonSchemaBoolean): TypeMedatata {
  if (schema) {
    return {
      kind: TypeMetadataKind.anyType,
    };
  } else {
    return {
      kind: TypeMetadataKind.noneType,
    };
  }
}

function transformObjectJsonSchema(
  schema: JsonSchemaObject,
  context: TransformJsonSchemaContext,
): TypeMedatata {
  const existingType: TypeMedatata | undefined =
    context.jsonSchemaToTypeMap.get(schema);

  if (existingType !== undefined) {
    return existingType;
  }

  const typeMetadataPartial: Partial<TypeMedatata> = {};
  context.jsonSchemaToTypeMap.set(schema, typeMetadataPartial as TypeMedatata);

  const id: string | undefined = schema.title;

  const typeConstraints: TypeMedatata[] = [];

  handleApplicatorVocabularyProperties(schema, context, typeConstraints);
  handleCoreVocabularyProperties(schema, context, typeConstraints);
  handleValidationVocabularyProperties(schema, typeConstraints);

  return buildTypeMetadata(id, typeMetadataPartial, typeConstraints);
}

function transformJsonSchemaType(schemaType: JsonSchemaType): TypeMedatata {
  switch (schemaType) {
    case jsonSchemaTypes.array:
      return {
        child: {
          kind: TypeMetadataKind.anyType,
        },
        kind: TypeMetadataKind.arrayType,
      };
    case jsonSchemaTypes.boolean:
      return {
        kind: TypeMetadataKind.booleanType,
      };
    case jsonSchemaTypes.integer:
      return {
        kind: TypeMetadataKind.integerType,
      };
    case jsonSchemaTypes.null:
      return {
        kind: TypeMetadataKind.literalType,
        literal: null,
      };
    case jsonSchemaTypes.number:
      return {
        kind: TypeMetadataKind.floatType,
      };
    case jsonSchemaTypes.object:
      return {
        kind: TypeMetadataKind.objectType,
      };
    case jsonSchemaTypes.string:
      return {
        kind: TypeMetadataKind.stringType,
      };
  }
}
