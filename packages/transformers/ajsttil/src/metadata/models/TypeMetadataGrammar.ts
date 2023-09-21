import { TypeMedatata } from './TypeMetadata';

export interface TypeMetadataGrammar {
  productions: Map<TypeMedatata, TypeMedatata[]>;
  root: TypeMedatata;
}
