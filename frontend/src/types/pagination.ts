export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string; 
}

export interface PaginationResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}