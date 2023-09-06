import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/uri');

import { JsonSchemaObject } from '@cuaklabs/json-schema-types/2020-12';
import { getBaseUri, GetBaseUriOptions } from '@cuaklabs/uri';

import { JsonRootSchema202012Fixtures } from '../fixtures/JsonRootSchema202012Fixtures';
import { getJsonSchemaBaseUri } from './getJsonSchemaBaseUri';

describe(getJsonSchemaBaseUri.name, () => {
  describe('having a JsonSchema with $id', () => {
    let jsonSchemaFixture: JsonSchemaObject;

    beforeAll(() => {
      jsonSchemaFixture = JsonRootSchema202012Fixtures.withId;
    });

    describe('when called', () => {
      let uriFixture: string;

      let result: unknown;

      beforeAll(() => {
        uriFixture = 'uri:fixture';

        (getBaseUri as jest.Mock<typeof getBaseUri>).mockReturnValueOnce(
          uriFixture,
        );

        result = getJsonSchemaBaseUri(jsonSchemaFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBaseUri()', () => {
        const expected: GetBaseUriOptions = {
          documentBaseUri: jsonSchemaFixture.$id,
        };

        expect(getBaseUri).toHaveBeenCalledTimes(1);
        expect(getBaseUri).toHaveBeenCalledWith(expected);
      });

      it('should return an Uri()', () => {
        expect(result).toBe(uriFixture);
      });
    });
  });

  describe('having a JsonSchema with no id', () => {
    let jsonSchemaFixture: JsonSchemaObject;

    beforeAll(() => {
      jsonSchemaFixture = JsonRootSchema202012Fixtures.withNoId;
    });

    describe('when called', () => {
      let uriFixture: string;

      let result: unknown;

      beforeAll(() => {
        uriFixture = 'uri:fixture';

        (getBaseUri as jest.Mock<typeof getBaseUri>).mockReturnValueOnce(
          uriFixture,
        );

        result = getJsonSchemaBaseUri(jsonSchemaFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBaseUri()', () => {
        const expected: GetBaseUriOptions = {
          documentBaseUri: undefined,
        };

        expect(getBaseUri).toHaveBeenCalledTimes(1);
        expect(getBaseUri).toHaveBeenCalledWith(expected);
      });

      it('should return an Uri()', () => {
        expect(result).toBe(uriFixture);
      });
    });
  });
});
