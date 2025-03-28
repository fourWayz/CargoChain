import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addProduct' : ActorMethod<
    [string, string],
    { 'Fail' : string } |
      { 'PaymentFailed' : string } |
      { 'InvalidPayload' : string } |
      { 'NotFound' : string } |
      { 'Success' : string } |
      { 'Unauthorized' : string } |
      { 'PaymentCompleted' : string } |
      { 'Exists' : string }
  >,
  'addShipment' : ActorMethod<
    [string, string, string],
    { 'Fail' : string } |
      { 'PaymentFailed' : string } |
      { 'InvalidPayload' : string } |
      { 'NotFound' : string } |
      { 'Success' : string } |
      { 'Unauthorized' : string } |
      { 'PaymentCompleted' : string } |
      { 'Exists' : string }
  >,
  'cancelShipment' : ActorMethod<
    [string],
    { 'Fail' : string } |
      { 'PaymentFailed' : string } |
      { 'InvalidPayload' : string } |
      { 'NotFound' : string } |
      { 'Success' : string } |
      { 'Unauthorized' : string } |
      { 'PaymentCompleted' : string } |
      { 'Exists' : string }
  >,
  'getProductCount' : ActorMethod<[], number>,
  'getProductDetails' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'manufacturer' : string,
        'owner' : string,
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
        'owner' : string,
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
        'owner' : string,
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
        'owner' : string,
        'from' : string,
        'productId' : string,
        'timestamp' : bigint,
      }
    >
  >,
  'updateProduct' : ActorMethod<
    [string, string, string],
    { 'Fail' : string } |
      { 'PaymentFailed' : string } |
      { 'InvalidPayload' : string } |
      { 'NotFound' : string } |
      { 'Success' : string } |
      { 'Unauthorized' : string } |
      { 'PaymentCompleted' : string } |
      { 'Exists' : string }
  >,
  'updateShipmentStatus' : ActorMethod<
    [string, string],
    { 'Fail' : string } |
      { 'PaymentFailed' : string } |
      { 'InvalidPayload' : string } |
      { 'NotFound' : string } |
      { 'Success' : string } |
      { 'Unauthorized' : string } |
      { 'PaymentCompleted' : string } |
      { 'Exists' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
