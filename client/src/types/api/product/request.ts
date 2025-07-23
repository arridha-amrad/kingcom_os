export interface CreteProductRequest {
  name: string;
  price: number;
  stock: number;
  description: string;
  specification: string;
  videoUrl: string;
  images: string[];
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}
