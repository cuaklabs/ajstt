import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./dereferenceJsonSchema');

import { JsonSchema } from '@cuaklabs/json-schema-types/2020-12';

import { JsonRootSchemaFixtures } from '../fixtures/JsonRootSchemaFixtures';
import { DereferenceFunction } from '../models/DereferenceFunction';
import { JsonSchemaParseResult } from '../models/JsonSchemaParseResult';
import { UriOptions } from '../models/UriOptions';
import { dereferenceJsonSchema } from './dereferenceJsonSchema';
import { parse } from './parse';

describe(parse.name, () => {
  let derefMock: jest.Mock<DereferenceFunction>;

  describe('having an array of schemas and uri options', () => {
    let jsonSchemaFixture: JsonSchema;
    let uriOptionsFixture: UriOptions;

    beforeAll(() => {
      jsonSchemaFixture = JsonRootSchemaFixtures.any;
      uriOptionsFixture = {
        encapsulatingDocumentBaseUri: 'sample://uri',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        (
          dereferenceJsonSchema as jest.Mock<typeof dereferenceJsonSchema>
        ).mockResolvedValueOnce(undefined);

        result = await parse(derefMock, [jsonSchemaFixture], uriOptionsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call dereferenceJsonSchema()', () => {
        expect(dereferenceJsonSchema).toHaveBeenCalledTimes(1);
        expect(dereferenceJsonSchema).toHaveBeenCalledWith(
          derefMock,
          jsonSchemaFixture,
          new Map(),
          uriOptionsFixture,
        );
      });

      it('should return JsonSchemaParseResult', () => {
        const expected: JsonSchemaParseResult = {
          referenceMap: new Map(),
          schemas: [jsonSchemaFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having an array of ParseJsonSchemaOptions', () => {
    let jsonSchemaFixture: JsonSchema;
    let uriOptionsFixture: UriOptions;

    beforeAll(() => {
      jsonSchemaFixture = JsonRootSchemaFixtures.any;
      uriOptionsFixture = {
        encapsulatingDocumentBaseUri: 'sample://uri',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(async () => {
        (
          dereferenceJsonSchema as jest.Mock<typeof dereferenceJsonSchema>
        ).mockResolvedValueOnce(undefined);

        result = await parse(derefMock, [
          {
            schema: jsonSchemaFixture,
            uriOptions: uriOptionsFixture,
          },
        ]);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call dereferenceJsonSchema()', () => {
        expect(dereferenceJsonSchema).toHaveBeenCalledTimes(1);
        expect(dereferenceJsonSchema).toHaveBeenCalledWith(
          derefMock,
          jsonSchemaFixture,
          new Map(),
          uriOptionsFixture,
        );
      });

      it('should return JsonSchemaParseResult', () => {
        const expected: JsonSchemaParseResult = {
          referenceMap: new Map(),
          schemas: [jsonSchemaFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
