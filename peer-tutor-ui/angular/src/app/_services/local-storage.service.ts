import { Injectable } from '@angular/core';
import { UniClass } from '../_models';
import { ClassDataService } from './class-data.service';
import { UserService } from './user.service';

const CURRENT_USER = {
  key: "currentUser",
  enrolled_classes: {
    key: "enrolled_classes",
  },
  student_id: {
    key: "student_id",
  }
}
//"{"_id":{"$oid":"5bee39df011dd6000a99f0bd"},"enrolled_classes":[],"meetings":[],"name":"first1 last1","password":"password1","schedules":[],"student_id":"1","username":"test1@gmail.com"}"

export {CURRENT_USER}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  
  constructor(
    private classDataService:ClassDataService,
    private userService:UserService,
  ) { }

  /**A general method to be used to save data into local storage
   * 
   * @param key key for the data
   * @param data data object to be saved into local storage
   */
  setLocalStorage(key:string, data:any){
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  /**A general method to get data from local storage
   * 
   * @param key key for the data
   */
  getLocalStorage(key: string):any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  /**A general method to remove an item from local storage by key
   * 
   * @param key item to be removed
   */
  removeLocalStorage(key:string){
    localStorage.removeItem(key);
  }

  /**A general method to be used to save data into session storage
   * 
   * @param key key for the data
   * @param data data object to be saved into session storage
   */
  setSessionStorage(key:string, data:any){
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to sessionStorage', e);
    }
  }

  /**A general method to get data from session storage
   * 
   * @param key key for the data
   */
  getSessionStorage(key: string):any {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from sessionStorage', e);
      return null;
    }
  }

  /**A general method to remove an item from session storage by key
   * 
   * @param key item to be removed
   */
  removeSessionStorage(key:string){
    sessionStorage.removeItem(key);
  }

  /**Get CurrentUser
   */
  getCurrentUser(){
    let currentUser:any;
    try {
      currentUser = this.getLocalStorage(CURRENT_USER.key);
    } catch (e) {
      console.error('Error getting enrolled_classes from localStorage', e);
      currentUser = null;
    }
    return currentUser;
  }

  setCurrentUser(u:any){
    this.setLocalStorage(CURRENT_USER.key, u)
  }

  /**Get currently enrolled Class by looking into localStorage,
   * or updating the localStorage by sending a GET request to the server before doing so.
   * 
   * @param refresh Need to send a new GET request to the server or not?
   */
  getEnrolledClass(refresh:boolean):UniClass[]{
    let result:UniClass[];
    let currentUser:any;

    try {
      currentUser = this.getLocalStorage(CURRENT_USER.key);
    }
    catch (e) {
      console.error('Error getting enrolled_classes from localStorage', e);
      result = null;
    }

    if (refresh) {
      this.refreshCurrentUser()
    }

    try {
      currentUser = this.getLocalStorage(CURRENT_USER.key);
      result = currentUser[CURRENT_USER.enrolled_classes.key];
    } catch (e) {
      console.error('Error getting enrolled_classes from localStorage', e);
      result = null;
    }
    return result;

  }

  refreshCurrentUser(){
    let currentUser = this.getLocalStorage(CURRENT_USER.key);
    this.userService.getByStudentId(currentUser[CURRENT_USER.student_id.key]).subscribe(d=>this.setLocalStorage(CURRENT_USER.key, currentUser))
  }

}
