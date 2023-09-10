import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../actions/traverseJsonSchema');
jest.mock('./getJsonSchemaBaseUri');

import {
  JsonSchema,
  JsonSchemaObject,
} from '@cuaklabs/json-schema-types/2020-12';

import { traverseJsonSchema } from '../actions/traverseJsonSchema';
import { JsonRootSchemaFixtures } from '../fixtures/JsonRootSchemaFixtures';
import { DereferenceFunction } from '../models/DereferenceFunction';
import { TraverseJsonSchemaCallbackParams } from '../models/TraverseJsonSchemaCallbackParams';
import { TraverseJsonSchemaParams } from '../models/TraverseJsonSchemaParams';
import { UriOptions } from '../models/UriOptions';
import { dereferenceJsonSchema } from './dereferenceJsonSchema';
import { getJsonSchemaBaseUri } from './getJsonSchemaBaseUri';

describe(dereferenceJsonSchema.name, () => {
  let derefMock: jest.Mock<DereferenceFunction>;
  let schemaFixture: JsonSchema;
  let uriOptionsFixture: UriOptions;

  beforeAll(() => {
    derefMock = jest.fn();
    schemaFixture = JsonRootSchemaFixtures.any;
    uriOptionsFixture = {};
  });

  describe('when called, and traverseJsonSchema() does not call callback', () => {
    let baseUriFixture: string;
    let referenceMapFixture: Map<string, JsonSchema>;

    let result: unknown;

    beforeAll(async () => {
      baseUriFixture = 'base://fixture';
      referenceMapFixture = new Map();

      (
        getJsonSchemaBaseUri as jest.Mock<typeof getJsonSchemaBaseUri>
      ).mockReturnValueOnce(baseUriFixture);

      (
        traverseJsonSchema as jest.Mock<typeof traverseJsonSchema>
      ).mockReturnValueOnce(undefined);

      result = await dereferenceJsonSchema(
        derefMock,
        schemaFixture,
        referenceMapFixture,
        uriOptionsFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getJsonSchemaBaseUri()', () => {
      expect(getJsonSchemaBaseUri).toHaveBeenCalledTimes(1);
      expect(getJsonSchemaBaseUri).toHaveBeenCalledWith(
        schemaFixture,
        uriOptionsFixture,
      );
    });

    it('should call traverseJsonSchema()', () => {
      const expectedParams: TraverseJsonSchemaParams = {
        schema: schemaFixture,
      };

      expect(traverseJsonSchema).toHaveBeenCalledTimes(1);
      expect(traverseJsonSchema).toHaveBeenCalledWith(
        expectedParams,
        expect.any(Function),
      );
    });

    it('should resolve to undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and traverseJsonSchema() calls callback twice with an schema with a reference', () => {
    let dereferencedSchemaFixture: JsonSchema;
    let dereferencedUriOptionsFixture: UriOptions;
    let subSchemaFixture: JsonSchemaObject;
    let baseUriFixture: string;
    let referenceMapFixture: Map<string, JsonSchema>;

    let result: unknown;

    beforeAll(async () => {
      dereferencedSchemaFixture = JsonRootSchemaFixtures.any;
      dereferencedUriOptionsFixture = {
        retrievalUri: 'dereferenced://uri/options',
      };
      subSchemaFixture = JsonRootSchemaFixtures.withRef;
      baseUriFixture = 'base://fixture';
      referenceMapFixture = new Map();

      (
        getJsonSchemaBaseUri as jest.Mock<typeof getJsonSchemaBaseUri>
      ).mockReturnValueOnce(baseUriFixture);

      (traverseJsonSchema as jest.Mock<typeof traverseJsonSchema>)
        .mockImplementationOnce(
          (
            params: TraverseJsonSchemaParams,
            callback: (params: TraverseJsonSchemaCallbackParams) => void,
          ) => {
            callback({
              jsonPointer: params.jsonPointer ?? '',
              parentJsonPointer: params.jsonPointer,
              parentSchema: schemaFixture,
              schema: subSchemaFixture,
            });
            callback({
              jsonPointer: params.jsonPointer ?? '',
              parentJsonPointer: params.jsonPointer,
              parentSchema: schemaFixture,
              schema: subSchemaFixture,
            });
          },
        )
        .mockImplementationOnce(() => undefined);

      derefMock.mockResolvedValueOnce({
        schema: dereferencedSchemaFixture,
        uriOptions: dereferencedUriOptionsFixture,
      });

      result = await dereferenceJsonSchema(
        derefMock,
        schemaFixture,
        referenceMapFixture,
        uriOptionsFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getJsonSchemaBaseUri()', () => {
      expect(getJsonSchemaBaseUri).toHaveBeenCalledTimes(2);
      expect(getJsonSchemaBaseUri).toHaveBeenNthCalledWith(
        1,
        schemaFixture,
        uriOptionsFixture,
      );
      expect(getJsonSchemaBaseUri).toHaveBeenNthCalledWith(
        2,
        dereferencedSchemaFixture,
        dereferencedUriOptionsFixture,
      );
    });

    it('should call traverseJsonSchema()', () => {
      const expectedFirstParams: TraverseJsonSchemaParams = {
        schema: schemaFixture,
      };

      const expectedSecondParams: TraverseJsonSchemaParams = {
        schema: dereferencedSchemaFixture,
      };

      expect(traverseJsonSchema).toHaveBeenCalledTimes(2);
      expect(traverseJsonSchema).toHaveBeenNthCalledWith(
        1,
        expectedFirstParams,
        expect.any(Function),
      );
      expect(traverseJsonSchema).toHaveBeenNthCalledWith(
        2,
        expectedSecondParams,
        expect.any(Function),
      );
    });

    it('should push references', () => {
      expect([...referenceMapFixture.entries()]).toStrictEqual([
        [subSchemaFixture.$ref, dereferencedSchemaFixture],
      ]);
    });

    it('should resolve to undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
