export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addProduct' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Fail' : IDL.Text,
            'PaymentFailed' : IDL.Text,
            'InvalidPayload' : IDL.Text,
            'NotFound' : IDL.Text,
            'Success' : IDL.Text,
            'Unauthorized' : IDL.Text,
            'PaymentCompleted' : IDL.Text,
            'Exists' : IDL.Text,
          }),
        ],
        [],
      ),
    'addShipment' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Fail' : IDL.Text,
            'PaymentFailed' : IDL.Text,
            'InvalidPayload' : IDL.Text,
            'NotFound' : IDL.Text,
            'Success' : IDL.Text,
            'Unauthorized' : IDL.Text,
            'PaymentCompleted' : IDL.Text,
            'Exists' : IDL.Text,
          }),
        ],
        [],
      ),
    'cancelShipment' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Fail' : IDL.Text,
            'PaymentFailed' : IDL.Text,
            'InvalidPayload' : IDL.Text,
            'NotFound' : IDL.Text,
            'Success' : IDL.Text,
            'Unauthorized' : IDL.Text,
            'PaymentCompleted' : IDL.Text,
            'Exists' : IDL.Text,
          }),
        ],
        [],
      ),
    'getProductCount' : IDL.Func([], [IDL.Int32], ['query']),
    'getProductDetails' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'manufacturer' : IDL.Text,
              'owner' : IDL.Text,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getProducts' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'manufacturer' : IDL.Text,
              'owner' : IDL.Text,
              'name' : IDL.Text,
              'description' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getShipmentCount' : IDL.Func([], [IDL.Int32], ['query']),
    'getShipmentDetails' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'to' : IDL.Text,
              'status' : IDL.Text,
              'owner' : IDL.Text,
              'from' : IDL.Text,
              'productId' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getShipments' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'to' : IDL.Text,
              'status' : IDL.Text,
              'owner' : IDL.Text,
              'from' : IDL.Text,
              'productId' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'updateProduct' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Fail' : IDL.Text,
            'PaymentFailed' : IDL.Text,
            'InvalidPayload' : IDL.Text,
            'NotFound' : IDL.Text,
            'Success' : IDL.Text,
            'Unauthorized' : IDL.Text,
            'PaymentCompleted' : IDL.Text,
            'Exists' : IDL.Text,
          }),
        ],
        [],
      ),
    'updateShipmentStatus' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Fail' : IDL.Text,
            'PaymentFailed' : IDL.Text,
            'InvalidPayload' : IDL.Text,
            'NotFound' : IDL.Text,
            'Success' : IDL.Text,
            'Unauthorized' : IDL.Text,
            'PaymentCompleted' : IDL.Text,
            'Exists' : IDL.Text,
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
