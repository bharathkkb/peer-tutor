import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UniClass } from '../_models/uniclass';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassDataService {
  constructor(private http: HttpClient) { }

  /**
   * Get an observable for a list of class data
   */
  getAll() {
    return this.http.get<UniClass[]>(`${environment.apiUrl}/class`);
  }

  /**
   * Get an observable for a class with specific id
   * @param id the id of the class you are requesting
   */
  getById(id:string) {
    return this.http.get(`${environment.apiUrl}/class/` + id);
  }

}
