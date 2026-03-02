export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
}