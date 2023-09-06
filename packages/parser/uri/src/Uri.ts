/*
 * Consider https://www.rfc-editor.org/info/rfc3986 as reference
 */

const URI_REGEX: RegExp =
  /^(?:([^:\\/?#]+):)?(?:\/\/([^\\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

const PATH_EMPTY: string = '';
const PATH_SEPARATOR: string = '/';
const PATH_CURRENT_SEGMENT: string = '.';
const PATH_PARENT_SEGMENT: string = '..';

export interface UriAttributes {
  scheme: string | undefined;
  authority: string | undefined;
  path: string;
  query: string | undefined;
  fragment: string | undefined;
}

export class Uri {
  public readonly attributes: UriAttributes;

  constructor(uri: string, baseUri?: string) {
    this.attributes =
      baseUri === undefined
        ? this.#buildAttributesFromAbsoluteUri(uri)
        : this.#buildAttributesFromRelativeUri(uri, baseUri);
  }

  public toString(): string {
    return this.#stringifyAttributes(this.attributes);
  }

  #buildAttributesFromAbsoluteUri(uri: string): UriAttributes {
    const regexpMatch: RegExpMatchArray | null = uri.match(URI_REGEX);

    if (regexpMatch === null) {
      throw new Error('Invalid URI');
    }

    const [, scheme, authority, path, query, fragment]: RegExpMatchArray =
      regexpMatch;

    return {
      authority: authority,
      fragment: fragment,
      path: path ?? '',
      query: query,
      scheme: scheme,
    };
  }

  #buildAttributesFromRelativeUri(uri: string, baseUri: string): UriAttributes {
    const baseUriObject: Uri = new Uri(baseUri);
    const uriObject: Uri = new Uri(uri);

    let scheme: string | undefined;
    let authority: string | undefined;
    let path: string;
    let query: string | undefined;
    const fragment: string | undefined = uriObject.attributes.fragment;

    if (uriObject.attributes.scheme === undefined) {
      if (uriObject.attributes.authority === undefined) {
        if (uriObject.attributes.path === PATH_EMPTY) {
          path = baseUriObject.attributes.path;
          query = uriObject.attributes.query ?? baseUriObject.attributes.query;
        } else {
          path = this.#buildMergedPath(baseUriObject, uriObject);
          query = uriObject.attributes.query;
        }

        authority = baseUriObject.attributes.authority;
      } else {
        authority = uriObject.attributes.authority;
        path = this.#removeDotSegments(uriObject.attributes.path);
        query = uriObject.attributes.query;
      }

      scheme = baseUriObject.attributes.scheme;
    } else {
      scheme = uriObject.attributes.scheme;
      authority = uriObject.attributes.authority;
      path = this.#removeDotSegments(uriObject.attributes.path);
      query = uriObject.attributes.query;
    }

    return {
      authority,
      fragment,
      path,
      query,
      scheme,
    };
  }

  #buildMergedPath(baseUriObject: Uri, uriObject: Uri): string {
    let path: string;

    if (uriObject.attributes.path.startsWith(PATH_SEPARATOR)) {
      path = this.#removeDotSegments(uriObject.attributes.path);
    } else {
      let basePath: string;

      if (
        baseUriObject.attributes.authority !== undefined &&
        baseUriObject.attributes.path === PATH_EMPTY
      ) {
        basePath = PATH_SEPARATOR;
      } else {
        basePath = baseUriObject.attributes.path;
      }

      path = this.#mergePaths(basePath, uriObject.attributes.path);
      path = this.#removeDotSegments(path);
    }

    return path;
  }

  #generatePathSegmentsStack(path: string): string[] {
    const stack: string[] = [];

    let lengthCounter: number = 0;

    for (let index: number = path.length; index > 0; --index) {
      const char: string = path[index - 1] as string;

      if (char === PATH_SEPARATOR) {
        stack.push(path.substring(index, index + lengthCounter));

        lengthCounter = 0;
      } else {
        ++lengthCounter;
      }
    }

    stack.push(path.substring(0, lengthCounter));

    return stack;
  }

  #mergePaths(basePath: string, path: string): string {
    return (
      basePath.substring(0, basePath.lastIndexOf(PATH_SEPARATOR) + 1) + path
    );
  }

  #removeDotSegments(path: string): string {
    const pathSegmentsStack: string[] = this.#generatePathSegmentsStack(path);
    const resolvedPathSegments: string[] = [];

    const isLastDotSegment: boolean =
      pathSegmentsStack[0] === PATH_PARENT_SEGMENT ||
      pathSegmentsStack[0] === PATH_CURRENT_SEGMENT;

    while (pathSegmentsStack.length > 0) {
      const pathSegment: string = pathSegmentsStack.pop() as string;

      switch (pathSegment) {
        case PATH_PARENT_SEGMENT:
          {
            const pathSegmentToBeRemoved: string | undefined =
              resolvedPathSegments.pop();

            if (
              resolvedPathSegments.length === 0 &&
              pathSegmentToBeRemoved === PATH_EMPTY
            ) {
              resolvedPathSegments.push(pathSegmentToBeRemoved);
            }
          }
          break;
        case PATH_CURRENT_SEGMENT:
          break;
        default:
          resolvedPathSegments.push(pathSegment);
      }
    }

    if (isLastDotSegment) {
      resolvedPathSegments.push(PATH_EMPTY);
    }

    return resolvedPathSegments.join(PATH_SEPARATOR);
  }

  #stringifyAttributes(uriAttributes: UriAttributes): string {
    let stringifiedUri: string = '';

    if (uriAttributes.scheme !== undefined) {
      stringifiedUri += `${uriAttributes.scheme}:`;
    }

    if (uriAttributes.authority !== undefined) {
      stringifiedUri += `//${uriAttributes.authority}`;
    }

    stringifiedUri += uriAttributes.path;

    if (uriAttributes.query !== undefined) {
      stringifiedUri += `?${uriAttributes.query}`;
    }

    if (uriAttributes.fragment !== undefined) {
      stringifiedUri += `#${uriAttributes.fragment}`;
    }

    return stringifiedUri;
  }
}
