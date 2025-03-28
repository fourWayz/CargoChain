import {
  IDL,
  query,
  update,
  msgCaller,
  Principal,
  time
} from "azle";
import { v4 } from "uuid";

// Define the Product structure using IDL
const Product = IDL.Record({
  id: IDL.Text,
  name: IDL.Text,
  description: IDL.Text,
  manufacturer: IDL.Text,
  owner: IDL.Text, // Added owner field
  timestamp: IDL.Nat64,
});

// Define the Shipment structure using IDL
const Shipment = IDL.Record({
  id: IDL.Text,
  productId: IDL.Text,
  from: IDL.Text,
  to: IDL.Text,
  status: IDL.Text,
  owner: IDL.Text, // Added owner field
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
  Unauthorized: IDL.Text,
});

// Define TypeScript types for the structures
type Product = {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  owner: string;
  timestamp: bigint;
};

type Shipment = {
  id: string;
  productId: string;
  from: string;
  to: string;
  status: string;
  owner: string;
  timestamp: bigint;
};

type Message =
  | { Exists: string }
  | { NotFound: string }
  | { InvalidPayload: string }
  | { PaymentFailed: string }
  | { PaymentCompleted: string }
  | { Success: string }
  | { Fail: string }
  | { Unauthorized: string };

// Define arrays for storage
let products: Product[] = [];
let shipments: Shipment[] = [];

export default class {

  /**
   * Adds a new product.
   * @param {string} name - The name of the product.
   * @param {string} description - The description of the product.
   */
  @update([IDL.Text, IDL.Text], Message)
  addProduct(name: string, description: string): Message {
    const productId: string = v4();
    const owner = msgCaller().toText();
    
    const product: Product = {
      id: productId,
      name,
      description,
      manufacturer: owner,
      owner,
      timestamp: time(),
    };
    
    products.push(product);
    return { Success: `Product added with ID ${productId}` };
  }

  /**
   * Adds a new shipment.
   * @param {string} productId - The ID of the product to ship.
   * @param {string} from - The origin of the shipment.
   * @param {string} to - The destination of the shipment.
   */
  @update([IDL.Text, IDL.Text, IDL.Text], Message)
  addShipment(productId: string, from: string, to: string): Message {
    const owner = msgCaller().toText();
    const product = products.find(p => p.id.toString() === productId.toString());
    
    if (!product) {
      return { NotFound: `Product with ID ${productId} not found` };
    }
    
    if (product.owner !== owner) {
      return { Unauthorized: "You don't own this product" };
    }
    
    const shipmentId: string = v4();
    const shipment: Shipment = {
      id: shipmentId,
      productId,
      from,
      to,
      status: "Pending",
      owner,
      timestamp: time(),
    };
    
    shipments.push(shipment);
    return { Success: `Shipment added with ID ${shipmentId}` };
  }

  /**
   * Updates the status of a shipment.
   * @param {string} shipmentId - The ID of the shipment.
   * @param {string} status - The new status of the shipment.
   */
  @update([IDL.Text, IDL.Text], Message)
  updateShipmentStatus(shipmentId: string, status: string): Message {
    const owner = msgCaller().toText();
    const shipment = shipments.find(s => s.id.toString() === shipmentId.toString());
    
    if (!shipment) {
      return { NotFound: `Shipment with ID ${shipmentId} not found` };
    }
    
    if (shipment.owner !== owner) {
      return { Unauthorized: "You don't own this shipment" };
    }
    
    shipment.status = status;
    return { Success: `Shipment status updated for ID ${shipmentId}` };
  }

  /**
   * Retrieves details of a product by its ID.
   * @param {string} productId - The ID of the product.
   */
  @query([IDL.Text], IDL.Opt(Product))
  getProductDetails(productId: string): [Product] | string {
    const owner = msgCaller().toText();
    const product = products.find(p => p.id.toString() === productId.toString());
    
    if (!product) {
      return `Product with ID ${productId} not found`;
    }
    
    if (product.owner !== owner) {
      return `Unauthorized access to product ${productId}`;
    }
    
    return [product];
  }

  /**
   * Retrieves all products for the current user.
   * @returns {Product[]} - A list of user's products.
   */
  @query([], IDL.Vec(Product))
  getProducts(): Product[] {
    const owner = msgCaller().toText();
    return products.filter(p => p.owner === owner);
  }

  /**
   * Retrieves details of a shipment by its ID.
   * @param {string} shipmentId - The ID of the shipment.
   */
  @query([IDL.Text], IDL.Opt(Shipment))
  getShipmentDetails(shipmentId: string): [Shipment] | string {
    const owner = msgCaller().toText();
    const shipment = shipments.find(s => s.id.toString() === shipmentId.toString());
    
    if (!shipment) {
      return `Shipment with ID ${shipmentId} not found`;
    }
    
    if (shipment.owner !== owner) {
      return `Unauthorized access to shipment ${shipmentId}`;
    }
    
    return [shipment];
  }

  /**
   * Retrieves all shipments for the current user.
   * @returns {Shipment[]} - A list of user's shipments.
   */
  @query([], IDL.Vec(Shipment))
  getShipments(): Shipment[] {
    const owner = msgCaller().toText();
    return shipments.filter(s => s.owner === owner);
  }

  /**
   * Retrieves the count of products for the current user.
   * @returns {number} - The number of user's products.
   */
  @query([], IDL.Int32)
  getProductCount(): number {
    const owner = msgCaller().toText();
    return products.filter(p => p.owner === owner).length;
  }

  /**
   * Retrieves the count of shipments for the current user.
   * @returns {number} - The number of user's shipments.
   */
  @query([], IDL.Int32)
  getShipmentCount(): number {
    const owner = msgCaller().toText();
    return shipments.filter(s => s.owner === owner).length;
  }

  /**
   * Updates the details of a product.
   * @param {string} id - The ID of the product.
   * @param {string} name - The new name of the product.
   * @param {string} description - The new description of the product.
   */
  @update([IDL.Text, IDL.Text, IDL.Text], Message)
  updateProduct(id: string, name: string, description: string): Message {
    const owner = msgCaller().toText();
    const product = products.find(p => p.id.toString() === id.toString());
    
    if (!product) {
      return { NotFound: `Product with ID ${id} not found` };
    }
    
    if (product.owner !== owner) {
      return { Unauthorized: "You don't own this product" };
    }
    
    product.name = name;
    product.description = description;
    return { Success: `Product details updated for ID ${id}` };
  }

  /**
   * Cancels a shipment.
   * @param {string} id - The ID of the shipment.
   */
  @update([IDL.Text], Message)
  cancelShipment(id: string): Message {
    const owner = msgCaller().toText();
    const shipment = shipments.find(s => s.id.toString() === id.toString());
    
    if (!shipment) {
      return { NotFound: `Shipment with ID ${id} not found` };
    }
    
    if (shipment.owner !== owner) {
      return { Unauthorized: "You don't own this shipment" };
    }
    
    if (shipment.status === "Pending" || shipment.status === "In Transit") {
      shipments = shipments.filter(s => s.id !== id);
      return { Success: `Shipment with ID ${id} cancelled successfully` };
    } else {
      return { Fail: `Shipment with ID ${id} cannot be cancelled` };
    }
  }
}