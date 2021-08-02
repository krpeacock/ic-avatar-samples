import type { Principal } from '@dfinity/principal';
export type About = string;
export interface Bio {
  'familyName' : [] | [FamilyName],
  'about' : [] | [About],
  'displayName' : [] | [DisplayName],
  'name' : [] | [Name],
  'givenName' : [] | [GivenName],
  'location' : [] | [Location],
}
export type DisplayName = string;
export type FamilyName = string;
export type GivenName = string;
export type Location = string;
export type Name = string;
export interface Profile {
  'id' : Principal,
  'bio' : Bio,
  'wallets' : [] | [Array<Wallet>],
}
export interface ProfileUpdateObj {
  'bio' : Bio,
  'wallets' : [] | [Array<Wallet>],
}
export interface Response {
  'code' : bigint,
  'message' : string,
  'success' : boolean,
}
export type Result = { 'ok' : Profile } |
  { 'err' : Response };
export type Wallet = string;
export interface _SERVICE {
  'create' : (arg_0: ProfileUpdateObj) => Promise<Result>,
  'read' : () => Promise<Result>,
  'whoami' : () => Promise<Principal>,
}
