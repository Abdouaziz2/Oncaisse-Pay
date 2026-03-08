import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { School, SchoolRegistration } from '../models/school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = 'http://localhost:2001/api-webServices/schools';

  constructor(private http: HttpClient) {}

  register(registration: SchoolRegistration): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registration);
  }

  getAllSchools(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getSchool(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateSchool(id: number, school: School): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, school);
  }

  activateSchool(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/activate`, {});
  }

  suspendSchool(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/suspend`, {});
  }

  deleteSchool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
