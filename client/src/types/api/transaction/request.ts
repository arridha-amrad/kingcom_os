export interface PlaceOrderRequest {
  total: number;
  items: PlaceOrderItems[];
  shipping: PlaceOrderShipping;
}

export interface PlaceOrderItems {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface PlaceOrderShipping {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  address: string;
}
