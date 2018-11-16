import { Injectable } from '@angular/core';
import { UniClass } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

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


  getClass(refresh:boolean):UniClass[]{
    

    try {
      return JSON.parse(localStorage.getItem('currentUser'))['enrolled_classes'];
    } catch (e) {
      console.error('Error getting enrolled_classes from localStorage', e);
      return null;
    }
  }

}
