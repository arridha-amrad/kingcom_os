export interface CreteProductResponse {
  message: string;
}

export interface GetProductsResponse {
  products: Product[];
}

export interface GetProductDetailResponse {
  product: Product;
}

export interface Product {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  name: string;
  slug: string;
  price: number;
  description: string;
  specification: string;
  stock: number;
  video_url: string;
  images: ProductImage[];
  // coming soon
  average_rating?: number | null;
  discount?: number | null;
}

export interface ProductImage {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null | Date;
  url: string;
  product_id: string;
}
