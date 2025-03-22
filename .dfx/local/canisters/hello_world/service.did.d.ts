import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addProduct' : ActorMethod<[string, string], string>,
  'addShipment' : ActorMethod<[string, string, string], string>,
  'cancelShipment' : ActorMethod<[string], string>,
  'getProductCount' : ActorMethod<[], number>,
  'getProductDetails' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'manufacturer' : string,
        'name' : string,
        'description' : string,
        'timestamp' : bigint,
      }
    ]
  >,
  'getProducts' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'manufacturer' : string,
        'name' : string,
        'description' : string,
        'timestamp' : bigint,
      }
    >
  >,
  'getShipmentCount' : ActorMethod<[], number>,
  'getShipmentDetails' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'to' : string,
        'status' : string,
        'from' : string,
        'productId' : string,
        'timestamp' : bigint,
      }
    ]
  >,
  'getShipments' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'to' : string,
        'status' : string,
        'from' : string,
        'productId' : string,
        'timestamp' : bigint,
      }
    >
  >,
  'updateProduct' : ActorMethod<[string, string, string], string>,
  'updateShipmentStatus' : ActorMethod<[string, string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
