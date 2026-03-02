import { StudentStatus } from '@core/models/enums.model';

export interface Student {
  id?: number;
  matricule?: string;
  firstName: string;
  lastName: string;
  className: string;
  phoneNumber?: string;
  email?: string;
  registrationDate: string;
  status?: StudentStatus;
  annualTuitionAmount?: number;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface StudentFilter {
  firstName?: string;
  lastName?: string;
  className?: string;
  registrationDate?: string;
  page?: number;
  size?: number;
}
