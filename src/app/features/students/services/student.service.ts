import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Student, StudentFilter } from '../models/student.model';
import { ApiResponse, PageMetadata } from '@core/models/response.model';

export interface StudentPageResponse {
  content: Student[];
  metadata: PageMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiService = inject(ApiService);
  private endpoint = 'students';

  getStudents(filter?: StudentFilter): Observable<StudentPageResponse> {
    return this.apiService.get<ApiResponse<Student[]>>(`${this.endpoint}/all`, filter).pipe(
      map(response => ({
        content: response.payload || [],
        metadata: response.metadata!
      }))
    );
  }

  getStudent(id: number): Observable<Student> {
    return this.apiService.get<ApiResponse<Student>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.payload!)
    );
  }

  createStudent(student: Student): Observable<Student> {
    return this.apiService.post<ApiResponse<Student>>(this.endpoint, student).pipe(
      map(response => response.payload!)
    );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.apiService.put<ApiResponse<Student>>(`${this.endpoint}/${id}`, student).pipe(
      map(response => response.payload!)
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
