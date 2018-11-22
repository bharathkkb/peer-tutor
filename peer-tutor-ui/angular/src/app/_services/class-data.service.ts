import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UniClass, UniClassSum } from '../_models/uniclass';
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

  /**@deprecated
   * @param id the id of the class you are requesting
   */
  getById(id:string) {
    return this.http.get<UniClass>(environment.apipath.getUniClassByClassCode+id);
  }

  /**Return a UniClass Object by Class Code
   * @param code the class code of the class you are requesting. exp: 22371
   */
  getByClassCode(code:string) {
    return this.http.get<UniClass>(environment.apipath.getUniClassByClassCode + code);
  }

  /**Return a list of UniClass Objects by Department Name
   * @param deptName department name. exp: "COMPUTER SCIENCE"
   */
  getByDeptName(deptName:string) {
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByDeptName + deptName);
  }

  /**Return a list of UniClass Objects by Instructor Name
   * @param instructorName "N Ferguson"
   */
  getByInstuctorName(instructorName:string){
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByInstructName + instructorName);
  }

  /**Return a list of UniClass Objects by Class Title
   * @param classTitle 
   */
  getByClassTitle(classTitle:string) {
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByClassTitle + classTitle);
  }

  /**Return a list of UniClass Objects by Class Name
   * @param className 
   */
  getByClassName(className:string){
    return this.http.get<UniClass[]>(environment.apipath.getUniClassByClassName + className);
  }

  /**
   * TODO: Wait for integration
   */
  getAllDept(){
    return this.http.get<any[]>(environment.apipath.getUniClassByDeptName)
  }

  toClassSum(c:UniClass):UniClassSum{
    let result:UniClassSum = {
      "_id": c._id.$oid,
      "class-name": c["class-name"],
      "class-code": c["class-code"],
      "start-dates": c.dates.substring(0, 8),
      "end-dates": c.dates.substring(9, 17),
      "days": c.days,
      "instructor": c.instructor,
      "location": c.location,
      "start-time": c.time.substring(0, 4),
      "end-time": c.time.substring(5, 10),
      "title": c.title,
      "section": c.section,
    }
    return result
  }

}
