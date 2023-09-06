import { beforeAll, describe, expect, it } from '@jest/globals';

import { GetBaseUriOptions, getBaseUri } from './getBaseUri';

describe(getBaseUri.name, () => {
  describe('having a GetBaseUriOptions with documentBaseUri, encapsulatingDocumentBaseUri and retrievalUri', () => {
    let getBaseUriOptionsFixture: GetBaseUriOptions;

    beforeAll(() => {
      getBaseUriOptionsFixture = {
        documentBaseUri: 'urn:document-uri',
        encapsulatingDocumentBaseUri: 'urn:root-document-uri',
        retrievalUri: 'urn:retrieval-uri',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getBaseUri(getBaseUriOptionsFixture);
      });

      it('should return documentBaseUri', () => {
        expect(result).toBe(getBaseUriOptionsFixture.documentBaseUri);
      });
    });
  });

  describe('having a GetBaseUriOptions with encapsulatingDocumentBaseUri and retrievalUri', () => {
    let getBaseUriOptionsFixture: GetBaseUriOptions;

    beforeAll(() => {
      getBaseUriOptionsFixture = {
        encapsulatingDocumentBaseUri: 'urn:root-document-uri',
        retrievalUri: 'urn:retrieval-uri',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getBaseUri(getBaseUriOptionsFixture);
      });

      it('should return encapsulatingDocumentBaseUri', () => {
        expect(result).toBe(
          getBaseUriOptionsFixture.encapsulatingDocumentBaseUri,
        );
      });
    });
  });

  describe('having a GetBaseUriOptions with retrievalUri', () => {
    let getBaseUriOptionsFixture: GetBaseUriOptions;

    beforeAll(() => {
      getBaseUriOptionsFixture = {
        retrievalUri: 'urn:retrieval-uri',
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getBaseUri(getBaseUriOptionsFixture);
      });

      it('should return retrievalUri', () => {
        expect(result).toBe(getBaseUriOptionsFixture.retrievalUri);
      });
    });
  });

  describe('having a GetBaseUriOptions with no properties', () => {
    let getBaseUriOptionsFixture: GetBaseUriOptions;

    beforeAll(() => {
      getBaseUriOptionsFixture = {};
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getBaseUri(getBaseUriOptionsFixture);
      });

      it('should return default uri', () => {
        expect(result).toBe('https://default.uri');
      });
    });
  });
});
