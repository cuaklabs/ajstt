import { JsonValue } from '@cuaklabs/json-schema-types';

export enum TypeMetadataKind {
  and,
  anyType,
  arrayType,
  booleanType,
  integerType,
  literalType,
  noneType,
  nullType,
  numberType,
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
  children: TChildren[];
}

export type AndTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.and>;
export type AnyTypeMetadata = BaseTypeMetadata<TypeMetadataKind.anyType>;
export type ArrayTypeMetadata =
  OneChildTypeMetadata<TypeMetadataKind.arrayType>;
export type BooleanTypeMetadata =
  BaseTypeMetadata<TypeMetadataKind.booleanType>;
export type IntegerTypeMetadata =
  BaseTypeMetadata<TypeMetadataKind.integerType>;
export interface LiteralTypeMetadata
  extends BaseTypeMetadata<TypeMetadataKind.literalType> {
  literal: JsonValue;
}
export type NoneTypeMetadata = BaseTypeMetadata<TypeMetadataKind.noneType>;
export type NullTypeMetadata = BaseTypeMetadata<TypeMetadataKind.nullType>;
export type NumberTypeMetadata = BaseTypeMetadata<TypeMetadataKind.numberType>;
export type OrTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.or>;
export interface PropertyTypeMetadata
  extends OneChildTypeMetadata<TypeMetadataKind.propertyType> {
  property: string;
}
export type StringTypeMetadata = BaseTypeMetadata<TypeMetadataKind.stringType>;
export type XorTypeMetadata = ManyChildrenTypeMetadata<TypeMetadataKind.xor>;

export type TypeMedatata =
  | AndTypeMetadata
  | AnyTypeMetadata
  | ArrayTypeMetadata
  | BooleanTypeMetadata
  | IntegerTypeMetadata
  | LiteralTypeMetadata
  | NoneTypeMetadata
  | NullTypeMetadata
  | NumberTypeMetadata
  | OrTypeMetadata
  | PropertyTypeMetadata
  | StringTypeMetadata
  | XorTypeMetadata;
