import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { DashboardStats } from '../models/dashboard.model';
import { ApiResponse } from '@core/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiService = inject(ApiService);
  private endpoint = 'dashboard';

  getStatistics(): Observable<DashboardStats> {
    return this.apiService.get<ApiResponse<DashboardStats>>(`${this.endpoint}/statistics`).pipe(
      map(response => response.payload!)
    );
  }
}
