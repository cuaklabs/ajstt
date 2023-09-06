/*
 * Consider https://www.rfc-editor.org/info/rfc3986 as reference
 *
 *  .----------------------------------------------------------.
 *  |  .----------------------------------------------------.  |
 *  |  |  .----------------------------------------------.  |  |
 *  |  |  |  .----------------------------------------.  |  |  |
 *  |  |  |  |  .----------------------------------.  |  |  |  |
 *  |  |  |  |  |       <relative-reference>       |  |  |  |  |
 *  |  |  |  |  `----------------------------------'  |  |  |  |
 *  |  |  |  | (5.1.1) Base URI embedded in content   |  |  |  |
 *  |  |  |  `----------------------------------------'  |  |  |
 *  |  |  | (5.1.2) Base URI of the encapsulating entity |  |  |
 *  |  |  |         (message, representation, or none)   |  |  |
 *  |  |  `----------------------------------------------'  |  |
 *  |  | (5.1.3) URI used to retrieve the entity            |  |
 *  |  `----------------------------------------------------'  |
 *  | (5.1.4) Default Base URI (application-dependent)         |
 *  `----------------------------------------------------------'
 */

const DEFALUT_URI: string = 'https://default.uri';

export interface GetBaseUriOptions {
  documentBaseUri?: string | undefined;
  encapsulatingDocumentBaseUri?: string | undefined;
  retrievalUri?: string | undefined;
}

export function getBaseUri(options?: GetBaseUriOptions): string {
  return (
    options?.documentBaseUri ??
    options?.encapsulatingDocumentBaseUri ??
    options?.retrievalUri ??
    DEFALUT_URI
  );
}
