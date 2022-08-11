import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';

export type TypedDataTypes = { [key: string]: TypedDataField[] }

export interface TypedData {
  types: TypedDataTypes
  primaryType: string
  domain: TypedDataDomain
  message: Record<string, any>
}

