import { JsonValue } from '@cuaklabs/json-schema-types';

export enum TypeMetadataKind {
  and,
  anyType,
  arrayType,
  booleanType,
  floatType,
  indexSignatureType,
  integerType,
  literalType,
  noneType,
  objectType,
  or,
  propertyType,
  stringType,
  xor,
}

export interface BaseTypeMetadata<TKind extends TypeMetadataKind> {
  id?: string;
  kind: TKind;
}

export interface OneChildTypeMetadata<TKind extends TypeMetadataKind>
  extends BaseTypeMetadata<TKind> {
  child: TypeMedatata;
}

export interface ManyChildrenTypeMetadata<
  TKind extends TypeMetadataKind,
  TChildren extends TypeMedatata[] = TypeMedatata[],
> extends BaseTypeMetadata<TKind> {
  children: TChildren;
}

export type AndTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.and>;
export type AnyTypeMetadata = BaseTypeMetadata<TypeMetadataKind.anyType>;
export type ArrayTypeMetadata =
  OneChildTypeMetadata<TypeMetadataKind.arrayType>;
export type BooleanTypeMetadata =
  BaseTypeMetadata<TypeMetadataKind.booleanType>;
export type FloatTypeMetadata = BaseTypeMetadata<TypeMetadataKind.floatType>;
export type IndexSignatureType =
  OneChildTypeMetadata<TypeMetadataKind.indexSignatureType>;
export type IntegerTypeMetadata =
  BaseTypeMetadata<TypeMetadataKind.integerType>;
export interface LiteralTypeMetadata
  extends BaseTypeMetadata<TypeMetadataKind.literalType> {
  literal: JsonValue;
}
export type NoneTypeMetadata = BaseTypeMetadata<TypeMetadataKind.noneType>;
export type ObjectTypeMetadata = BaseTypeMetadata<TypeMetadataKind.objectType>;
export type OrTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.or>;
export interface PropertyTypeMetadata
  extends OneChildTypeMetadata<TypeMetadataKind.propertyType> {
  isOptional: boolean;
  property: string;
}
export type StringTypeMetadata = BaseTypeMetadata<TypeMetadataKind.stringType>;
export type XorTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.xor>;

export type TypeMedatata =
  | AndTypeMetadata
  | AnyTypeMetadata
  | ArrayTypeMetadata
  | BooleanTypeMetadata
  | FloatTypeMetadata
  | IndexSignatureType
  | IntegerTypeMetadata
  | LiteralTypeMetadata
  | NoneTypeMetadata
  | ObjectTypeMetadata
  | OrTypeMetadata
  | PropertyTypeMetadata
  | StringTypeMetadata
  | XorTypeMetadata;
