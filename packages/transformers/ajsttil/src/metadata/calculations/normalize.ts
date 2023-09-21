import { TypeMedatata } from '../models/TypeMetadata';
import { TypeMetadataGrammar } from '../models/TypeMetadataGrammar';

export function normalize(typeMetadata: TypeMedatata): TypeMetadataGrammar {
  const grammar: TypeMetadataGrammar = {
    productions: new Map(),
    root: typeMetadata,
  };

  return grammar;
}
