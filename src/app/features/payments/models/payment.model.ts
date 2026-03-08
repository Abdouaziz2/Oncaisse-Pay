import { PaymentStatus, PaymentMethod } from '@core/models/enums.model';

export interface Payment {
  id?: number;
  studentMatricule?: string;
  studentFullName?: string;
  studentClassName?: string;
  amount?: number;
  paymentPeriod?: string;
  availableDate?: string;
  dueDate?: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  phoneNumber?: string;
  paymentDate?: string;
  receiptNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCheck {
  matricule: string;
  phoneNumber?: string;
}

export interface PaymentProcess {
  studentMatricule: string;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

export interface PaymentFilter {
  status?: string;
  paymentPeriod?: string;
  studentMatricule?: string;
  page?: number;
  size?: number;
}
