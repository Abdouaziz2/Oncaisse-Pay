export interface School {
  id?: number;
  schoolName: string;
  email: string;
  phone: string;
  address?: string;
  country: string;
  city: string;
  schoolStatus?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SchoolRegistration {
  schoolName: string;
  email: string;
  phone: string;
  address?: string;
  country: string;
  city: string;
  adminUsername: string;
  adminPassword: string;
}
