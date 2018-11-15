import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

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