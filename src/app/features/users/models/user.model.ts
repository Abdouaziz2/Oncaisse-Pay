export interface User {
  id?: number;
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: Role;
  schoolId?: number;
  schoolName?: string;
  isActive?: boolean;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  STUDENT = 'STUDENT'
}

export const ASSIGNABLE_ROLES = [
  { value: Role.ADMIN, label: 'Administrateur' },
  { value: Role.CASHIER, label: 'Caissier' }
];
