import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Class } from '../models/class.model';
import { ApiResponse } from '@core/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiService = inject(ApiService);
  private endpoint = 'classes';

  getClasses(): Observable<Class[]> {
    return this.apiService.get<ApiResponse<Class[]>>(`${this.endpoint}/all`).pipe(
      map(response => response.payload || [])
    );
  }

  getClass(id: number): Observable<Class> {
    return this.apiService.get<ApiResponse<Class>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.payload!)
    );
  }

  createClass(classData: Class): Observable<Class> {
    return this.apiService.post<ApiResponse<Class>>(this.endpoint, classData).pipe(
      map(response => response.payload!)
    );
  }

  updateClass(id: number, classData: Class): Observable<Class> {
    return this.apiService.put<ApiResponse<Class>>(`${this.endpoint}/${id}`, classData).pipe(
      map(response => response.payload!)
    );
  }

  deleteClass(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
