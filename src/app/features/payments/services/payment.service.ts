import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Payment, PaymentCheck, PaymentProcess, PaymentFilter } from '../models/payment.model';
import { ApiResponse, PageMetadata } from '@core/models/response.model';

export interface PaymentPageResponse {
  content: Payment[];
  metadata: PageMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiService = inject(ApiService);
  private endpoint = 'payments';

  checkPayment(data: PaymentCheck): Observable<Payment> {
    return this.apiService.post<ApiResponse<Payment>>(`${this.endpoint}/check`, data).pipe(
      map(response => response.payload!)
    );
  }

  processPayment(data: PaymentProcess): Observable<Payment> {
    return this.apiService.post<ApiResponse<Payment>>(`${this.endpoint}/process`, data).pipe(
      map(response => response.payload!)
    );
  }

  getPayments(filter?: PaymentFilter): Observable<PaymentPageResponse> {
    return this.apiService.get<ApiResponse<Payment[]>>(`${this.endpoint}/all`, filter).pipe(
      map(response => ({
        content: response.payload || [],
        metadata: response.metadata!
      }))
    );
  }

  getPayment(id: number): Observable<Payment> {
    return this.apiService.get<ApiResponse<Payment>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.payload!)
    );
  }

  generateMonthlyPayments(): Observable<void> {
    return this.apiService.post<ApiResponse<void>>(`${this.endpoint}/generate`, {}).pipe(
      map(() => undefined)
    );
  }
}
