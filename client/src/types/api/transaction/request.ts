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

export interface OrdersResponse {
  orders: Order[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  billingAddress: string;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  shipping: Shipping;
  orderItems: OrderItem[];
}

export interface Shipping {
  id: number;
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  address: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  weight: number;
  slug: string;
  price: number;
  stock: number;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  url: string;
}
