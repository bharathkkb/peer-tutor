import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getById(id: string) {
        return this.http.get(environment.apipath.getStudentById + id);
    }

    getByName(name:string){
        return this.http.get(environment.apipath.getStudentsByName + name);
    }

    register(user: any) {
        return this.http.post(environment.apipath.register, user);
    }

    //Not in used
    update(user: any) {
        return this.http.put(environment.apipath.putStudent, user);
    }
}