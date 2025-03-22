import {
    IDL,
    query,
    update,
    msgCaller,
    Principal,
    time
  } from "azle";
  import { v4 as uuidv4 } from "uuid";
  
  // Define the Product structure using IDL
  const Product = IDL.Record({
    id: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    manufacturer: IDL.Text,
    timestamp: IDL.Nat64,
  });
  
  // Define the Shipment structure using IDL
  const Shipment = IDL.Record({
    id: IDL.Text,
    productId: IDL.Text,
    from: IDL.Text,
    to: IDL.Text,
    status: IDL.Text,
    timestamp: IDL.Nat64,
  });
  
  // Define the Location structure using IDL
  const Location = IDL.Record({
    name: IDL.Text,
    latitude: IDL.Int32,
    longitude: IDL.Int32,
  });
  
  // Define the Transaction structure using IDL
  const Transaction = IDL.Record({
    id: IDL.Text,
    shipmentId: IDL.Text,
    location: Location,
    timestamp: IDL.Nat64,
  });
  
  
  // Define the Message variant for responses
  const Message = IDL.Variant({
    Exists: IDL.Text,
    NotFound: IDL.Text,
    InvalidPayload: IDL.Text,
    PaymentFailed: IDL.Text,
    PaymentCompleted: IDL.Text,
    Success: IDL.Text,
    Fail: IDL.Text,
  });
  
  // Define TypeScript types for the structures
  type Product = {
    id: string;
    name: string;
    description: string;
    manufacturer: string;
    timestamp: bigint;
  };
  
  type Shipment = {
    id: string;
    productId: string;
    from: string;
    to: string;
    status: string;
    timestamp: bigint;
  };
  
  type Location = {
    name: string;
    latitude: number;
    longitude: number;
  };

 
  
  type Message =
    | { Exists: string }
    | { NotFound: string }
    | { InvalidPayload: string }
    | { PaymentFailed: string }
    | { PaymentCompleted: string }
    | { Success: string }
    | { Fail: string };
  
  
    // Define arrays for storage
let products: Product[] = [];
let shipments: Shipment[] = [];
  export default class{

    /**
     * Adds a new product.
     * @param {string} name - The name of the product.
     * @param {string} description - The description of the product.
     */
    @update([IDL.Text, IDL.Text], IDL.Text)
    addProduct(name: string, description: string) : string {
      const productId: string = uuidv4();
      const product: Product = {
        id: productId,
        name,
        description,
        manufacturer: msgCaller().toText(),
        timestamp: time(),
      };
      products.push(product);
      return `Product added with ID ${productId}`;
    }
  
    /**
     * Adds a new shipment.
     * @param {string} productId - The ID of the product to ship.
     * @param {string} from - The origin of the shipment.
     * @param {string} to - The destination of the shipment.
     */
    @update([IDL.Text, IDL.Text, IDL.Text], IDL.Text)
    addShipment(productId: string, from: string, to: string): string {
      const shipmentId: string = uuidv4();
      const shipment: Shipment = {
        id: shipmentId,
        productId,
        from,
        to,
        status: "Pending",
        timestamp: time(),
      };
      shipments.push(shipment);
      return  `Shipment added with ID ${shipmentId}`;
    }
  
    /**
     * Updates the status of a shipment.
     * @param {string} shipmentId - The ID of the shipment.
     * @param {string} status - The new status of the shipment.
     * @returns {Result<Message, Message>} - A success or error message.
     */
    @update([IDL.Text, IDL.Text], IDL.Text)
    updateShipmentStatus(shipmentId: string, status: string): string {
      const shipment: Shipment | undefined = shipments.find((shipment)=> shipment.id.toString() == shipmentId.toString());
      if (!shipment) {
        return `Shipment with ID ${shipmentId} not found`;
      }

      shipment.status = status;
      shipments.push(shipment);
      return `Shipment status updated for ID ${shipmentId}`;
    }
  
    /**
     * Retrieves details of a product by its ID.
     * @param {string} productId - The ID of the product.
     * @returns {Result<Product, Message>} - The product details or an error message.
     */
    @query([IDL.Text], Result(Product, Message))
    getProductDetails(productId: string): Result<Product, Message> {
      const productOpt: Opt<Product> = products.get(productId);
      if ("None" in productOpt) {
        return Err({ NotFound: `Product with ID ${productId} not found` });
      }
      return Ok(productOpt.Some);
    }
  
    /**
     * Retrieves all products.
     * @returns {Product[]} - A list of all products.
     */
    @query([], IDL.Vec(Product))
    getProducts(): Product[] {
      return products.values();
    }
  
    /**
     * Retrieves details of a shipment by its ID.
     * @param {string} shipmentId - The ID of the shipment.
     * @returns {Result<Shipment, Message>} - The shipment details or an error message.
     */
    @query([IDL.Text], Result(Shipment, Message))
    getShipmentDetails(shipmentId: string): Result<Shipment, Message> {
      const shipmentOpt: Opt<Shipment> = shipments.get(shipmentId);
      if ("None" in shipmentOpt) {
        return Err({ NotFound: `Shipment with ID ${shipmentId} not found` });
      }
      return Ok(shipmentOpt.Some);
    }
  
    /**
     * Retrieves all shipments.
     * @returns {Shipment[]} - A list of all shipments.
     */
    @query([], IDL.Vec(Shipment))
    getShipments(): Shipment[] {
      return shipments.values();
    }
  
    /**
     * Retrieves the canister's address.
     * @returns {string} - The canister's address.
     */
    @query([], IDL.Text)
    getCanisterAddress(): string {
      return hexAddressFromPrincipal(ic.id(), 0);
    }
  
    /**
     * Retrieves the address from a Principal.
     * @param {Principal} principal - The Principal to convert.
     * @returns {string} - The address of the Principal.
     */
    @query([IDL.Principal], IDL.Text)
    getAddressFromPrincipal(principal: Principal): string {
      return hexAddressFromPrincipal(principal, 0);
    }
  
    /**
     * Retrieves the count of products.
     * @returns {number} - The number of products.
     */
    @query([], IDL.Int32)
    getProductCount(): number {
      return Number(products.len().toString());
    }
  
    /**
     * Retrieves the count of shipments.
     * @returns {number} - The number of shipments.
     */
    @query([], IDL.Int32)
    getShipmentCount(): number {
      return Number(shipments.len().toString());
    }
  
    /**
     * Updates the details of a product.
     * @param {string} id - The ID of the product.
     * @param {string} name - The new name of the product.
     * @param {string} description - The new description of the product.
     * @returns {Result<Message, Message>} - A success or error message.
     */
    @update([IDL.Text, IDL.Text, IDL.Text], Result(Message, Message))
    updateProduct(id: string, name: string, description: string): Result<Message, Message> {
      const productOpt: Opt<Product> = products.get(id);
      if ("None" in productOpt) {
        return Err({ NotFound: `Product with ID ${id} not found` });
      }
      const product: Product = productOpt.Some;
      product.name = name;
      product.description = description;
      products.insert(id, product);
      return Ok({ Success: `Product details updated for ID ${id}` });
    }
  
    /**
     * Cancels a shipment.
     * @param {string} id - The ID of the shipment.
     * @returns {Result<Message, Message>} - A success or error message.
     */
    @update([IDL.Text], Result(Message, Message))
    cancelShipment(id: string): Result<Message, Message> {
      const shipmentOpt: Opt<Shipment> = shipments.get(id);
      if ("None" in shipmentOpt) {
        return Err({ NotFound: `Shipment with ID ${id} not found` });
      }
      const shipment: Shipment = shipmentOpt.Some;
      if (shipment.status === "Pending" || shipment.status === "In Transit") {
        shipments.remove(id);
        return Ok({ Success: `Shipment with ID ${id} cancelled successfully` });
      } else {
        return Err({ Fail: `Shipment with ID ${id} cannot be cancelled` });
      }
    }
  }