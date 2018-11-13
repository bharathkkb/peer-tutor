import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { fakeUsers } from '../../assets/fakedata/fakelogin';
import { fakeclasses } from '../../assets/fakedata/fakeclasses';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(){}

    intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
        
        // a || b is  similar to ternary operator ( bool ? t : f ) 
        //but will evaluate b for every falsy value, such as 0, "", false, etc.
        //https://softwareengineering.stackexchange.com/questions/82593/javascript-ternary-operator-vs
        
        /**a list of previously registered fake users in localStorage*/
        let storedUsers:any[] = JSON.parse(localStorage.getItem('users')) || [];

        /**fake data in asset + previously registered fake users*/
        let users:any[] = fakeUsers.concat(storedUsers);
        /**fake uniClasses in asset. currently no plan to add more so it stay */
        let uniClasses:any[] = fakeclasses;
        
        return of(null).pipe(mergeMap(() => {

            // authenticate
            /*
                if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === request.body.username && user.password === request.body.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return 200 OK with user details and fake jwt token
                        let user = filteredUsers[0];
                        let body = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            token: 'fake-jwt-token',
                        };

                        return of(new HttpResponse({ status: 200, body: body }));
                    } else {
                        // else return 400 bad request
                        return throwError({ error: { message: 'Username or password is incorrect' } });
                    }
                }
            */
            
            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised1' } });
                }
            }

            // get user by id
            /* 
                if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        return of(new HttpResponse({ status: 200, body: user }));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return throwError({ status: 401, error: { message: 'Unauthorised2' } });
                    }
                }
            */

            // get Uni classes
            if (request.url.endsWith('/class') && request.method === 'GET') {
                /* 
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        if(request.params.get("userId") === "1") {
                            let cherrypickArr = [uniClasses[0], uniClasses[2], uniClasses[4]];
                            return of(new HttpResponse({ status: 200, body: cherrypickArr }));
                        }
                        return of(new HttpResponse({ status: 200, body: uniClasses }));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return throwError({ status: 401, error: { message: 'Unauthorised1-uniclass' } });
                    }
                */
                return of(new HttpResponse({ status: 200, body: uniClasses }));
            }

            // get one Uni class by id
            if (request.url.match(/\/class\/[a-z0-9]+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                /* 
                    if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = request.url.split('/');
                        let classId = urlParts[urlParts.length - 1];
                        let matchedClasses = uniClasses.filter(c => { return c["_id"] === classId; });
                        let resultClass = matchedClasses.length ? matchedClasses[0] : null;

                        return of(new HttpResponse({ status: 200, body: resultClass }));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        return throwError({ status: 401, error: { message: 'Unauthorised2-uniclass' } });
                    }
                */

                let urlParts = request.url.split('/');
                let classId = urlParts[urlParts.length - 1];
                let matchedClasses = uniClasses.filter(c => { return c["_id"] === classId; });
                let resultClass = matchedClasses.length ? matchedClasses[0] : null;

                return of(new HttpResponse({ status: 200, body: resultClass }));
            }


            // register user
            /* 
                if (request.url.endsWith('/users/register') && request.method === 'POST') {
                    // get new user object from post body
                    let newUser = request.body;

                    // validation
                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                    }

                    // save new user
                    newUser.id = (users.length + 1).toString();
                    // users.push(newUser);
                    //TODO: DEBUG
                    console.log("DEBUG1-1")
                    storedUsers.push(newUser);
                    console.log("DEBUG1-2")

                    // localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('users', JSON.stringify(storedUsers));

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                }
            */

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised3' } });
                }
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};