import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UniClass } from '../_models/uniclass';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassDataService {
  constructor(private http: HttpClient) { }

  /**TODO: use real api
   * Get an observable for a list of class data
   */
  getAll() {
    return this.http.get<UniClass[]>("localhost:5000/test/api/uniclass/all");
  }

  /**TODO: use real api
   * Get an observable for a class with specific id
   * @param id the id of the class you are requesting
   */
  getById(id:string) {
    return this.http.get<UniClass>("localhost:5000/test/api/uniclass/"+id);
  }

  getByDeptName(deptName:string) {
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByDeptName + deptName);
  }

  getByInstuctorName(instructorName:string){
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByInstructName + instructorName);
  }

  getByClassTitle(classTitle:string) {
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByClassTitle + classTitle);
  }

  getByClassName(className:string){
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByClassName + className);
  }

}
