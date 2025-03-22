export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addProduct' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'addShipment' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'cancelShipment' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getProductCount' : IDL.Func([], [IDL.Int32], ['query']),
    'getProductDetails' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'manufacturer' : IDL.Text,
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
              'from' : IDL.Text,
              'productId' : IDL.Text,
              'timestamp' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'updateProduct' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'updateShipmentStatus' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
