import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment'; //TODO: delete
import { apipath } from '../../environments/apipath';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    //Not in used
    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get(apipath.getStudentById.path + id);
    }

    register(user: any) {
        return this.http.post(apipath.register.path, user);
    }

    //Not in used
    update(user: any) {
        return this.http.put(`${environment.apiUrl}/users/` + user.id, user);
    }

    //Not in used
    delete(id: any) {
        return this.http.delete(`${environment.apiUrl}/users/` + id);
    }
}