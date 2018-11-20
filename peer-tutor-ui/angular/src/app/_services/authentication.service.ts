import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  /**Login, POST request
   * 
   * Reponse Example:
   * 
    ```javascript
    {
        "_id": {
            "$oid": "5bf099cd2fd7e5000a164bea"
        },
        "enrolled_classes": [
            "22088"
        ],
        "meetings": [],
        "name": "first1 last1",
        "password": "password1",
        "schedules": [],
        "student_id": "1",
        "username": "test1@gmail.com"
    }
    ```
   * 
   * @param username email address as username
   * @param password 
   */
  login(username: string, password: string) {
      return this.http.post<any>(environment.apipath.login, { username: username, password: password })
          .pipe(map(user => {
              // login successful if there's a jwt token in the response
            //   if (user && user.token) {
              if (user) { //Implement Token later
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }

              return user;
          }));
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
  }
}