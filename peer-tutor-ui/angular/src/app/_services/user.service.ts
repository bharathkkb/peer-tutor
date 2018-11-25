﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { UserRegister, Student } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getByStudentId(id: string) {
        return this.http.get<Student>(environment.apipath.getStudentById + id);
    }

    getByName(name:string){
        return this.http.get<Student[]>(environment.apipath.getStudentsByName + name);
    }

    register(user: any) {
        return this.http.post<UserRegister>(environment.apipath.register, user);
    }

    //Not in used
    update(user: any) {
        return this.http.put<Student>(environment.apipath.putStudent, user);
    }
}