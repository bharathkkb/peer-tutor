import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  getAll(userId: string) {
    let params = new HttpParams().set('userId', userId);
    console.log(params)
    return this.http.get<UniClass[]>(`${environment.apiUrl}/class`, {params});
  }

  /**
   * Get an observable for a class with specific id
   * @param id the id of the class you are requesting
   */
  getById(id:string) {
    return this.http.get<UniClass>(`${environment.apiUrl}/class/` + id);
  }

}
