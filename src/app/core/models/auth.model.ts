import { Role } from './enums.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  username: string;
  role: Role;
  schoolId?: number;
}

export interface User {
  username: string;
  role: Role;
  schoolId?: number;
}
