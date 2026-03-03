export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
}