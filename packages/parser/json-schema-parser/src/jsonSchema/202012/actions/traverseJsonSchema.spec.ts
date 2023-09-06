import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  JsonRootSchemaObject,
  JsonSchema,
} from '@cuaklabs/json-schema-types/2020-12';

import { JsonRootSchemaFixtures } from '../fixtures/JsonRootSchemaFixtures';
import { TraverseJsonSchemaCallbackParams } from '../models/TraverseJsonSchemaCallbackParams';
import { traverseJsonSchema } from './traverseJsonSchema';

describe(traverseJsonSchema.name, () => {
  let callbackMock: jest.Mock<
    (params: TraverseJsonSchemaCallbackParams) => void
  >;

  beforeAll(() => {
    callbackMock = jest.fn();
  });

  describe('when called', () => {
    beforeAll(() => {
      traverseJsonSchema({ schema: JsonRootSchemaFixtures.any }, callbackMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call callback() with the schema', () => {
      const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
        {
          jsonPointer: '',
          parentJsonPointer: undefined,
          parentSchema: undefined,
          schema: JsonRootSchemaFixtures.any,
        };

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(
        expectedTraverseJsonSchemaCallbackParams,
      );
    });
  });

  describe.each<[string, JsonRootSchemaObject]>([
    ['$defs', JsonRootSchemaFixtures.with$DefsOne],
    ['dependentSchemas', JsonRootSchemaFixtures.withDependentSchemasOne],
    ['patternProperties', JsonRootSchemaFixtures.withPatternProperiesOne],
    ['properties', JsonRootSchemaFixtures.withProperiesOne],
  ])(
    '(key to schema map) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchemaObject): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with every subschema', () => {
        const subschemaMap: Record<string, JsonSchema> = schemaFixture[
          schemaKey
        ] as Record<string, JsonSchema>;

        const subschemaMapEntries: [string, JsonSchema][] =
          Object.entries(subschemaMap);

        expect(callbackMock).toHaveBeenCalledTimes(
          subschemaMapEntries.length + 1,
        );

        for (const [
          index,
          [subschemaKey, subschema],
        ] of subschemaMapEntries.entries()) {
          const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
            {
              jsonPointer: `/${schemaKey}/${subschemaKey}`,
              parentJsonPointer: '',
              parentSchema: schemaFixture,
              schema: subschema,
            };

          expect(callbackMock).toHaveBeenNthCalledWith(
            index + 2,
            expectedTraverseJsonSchemaCallbackParams,
          );
        }
      });
    },
  );

  describe.each<[string, JsonRootSchemaObject]>([
    ['allOf', JsonRootSchemaFixtures.withAllOfTwo],
    ['anyOf', JsonRootSchemaFixtures.withAnyOfTwo],
    ['oneOf', JsonRootSchemaFixtures.withOneOfTwo],
    ['prefixItems', JsonRootSchemaFixtures.withPrefixItemsOne],
  ])(
    '(schema array) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchemaObject): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with every subschema', () => {
        const schemaArrays: JsonSchema[] = schemaFixture[
          schemaKey
        ] as JsonSchema[];

        expect(callbackMock).toHaveBeenCalledTimes(schemaArrays.length + 1);

        for (const [subschemaIndex, subschema] of schemaArrays.entries()) {
          const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
            {
              jsonPointer: `/${schemaKey}/${subschemaIndex}`,
              parentJsonPointer: '',
              parentSchema: schemaFixture,
              schema: subschema,
            };

          expect(callbackMock).toHaveBeenNthCalledWith(
            subschemaIndex + 2,
            expectedTraverseJsonSchemaCallbackParams,
          );
        }
      });
    },
  );

  describe.each<[string, JsonRootSchemaObject]>([
    ['additionalProperties', JsonRootSchemaFixtures.withAdditionalProperties],
    ['contains', JsonRootSchemaFixtures.withContains],
    ['else', JsonRootSchemaFixtures.withElse],
    ['if', JsonRootSchemaFixtures.withIf],
    ['items', JsonRootSchemaFixtures.withItems],
    ['not', JsonRootSchemaFixtures.withNot],
    ['propertyNames', JsonRootSchemaFixtures.withProperyNames],
    ['then', JsonRootSchemaFixtures.withThen],
    ['unevaluatedItems', JsonRootSchemaFixtures.withUnevaluatedItems],
    ['unevaluatedProperties', JsonRootSchemaFixtures.withUnevaluatedProperties],
  ])(
    '(schema) having a schema with "%s"',
    (schemaKey: string, schemaFixture: JsonRootSchemaObject): void => {
      beforeAll(() => {
        traverseJsonSchema({ schema: schemaFixture }, callbackMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback() with the schema', () => {
        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: '',
            parentJsonPointer: undefined,
            parentSchema: undefined,
            schema: schemaFixture,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          1,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });

      it('should call callback() with the subschema', () => {
        const subschema: JsonSchema = schemaFixture[schemaKey] as JsonSchema;

        expect(callbackMock).toHaveBeenCalledTimes(2);

        const expectedTraverseJsonSchemaCallbackParams: TraverseJsonSchemaCallbackParams =
          {
            jsonPointer: `/${schemaKey}`,
            parentJsonPointer: '',
            parentSchema: schemaFixture,
            schema: subschema,
          };

        expect(callbackMock).toHaveBeenNthCalledWith(
          2,
          expectedTraverseJsonSchemaCallbackParams,
        );
      });
    },
  );
});
