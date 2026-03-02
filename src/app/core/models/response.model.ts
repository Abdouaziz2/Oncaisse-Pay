export type ResponseStatus = 
  | 'OK' 
  | 'CREATED' 
  | 'BAD_REQUEST' 
  | 'UNAUTHORIZED'
  | 'NOT_FOUND' 
  | 'DUPLICATE_ENTITY'
  | 'EXCEPTION';

export interface ApiResponse<T> {
  status: ResponseStatus;
  payload?: T;
  metadata?: PageMetadata;
  message?: string | any;
}

export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
