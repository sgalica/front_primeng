// src/app/auth/auth.service.ts

import {Injectable} from '@angular/core';
import {JwtHelperService as _JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Subject} from 'rxjs/Rx';
import {User} from './user';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';


export const JwtHelperService = {
    provide: _JwtHelperService,
    useFactory: () => {
        return new _JwtHelperService();
    }
};

@Injectable()
export class AuthService {

    itemValue = new Subject();


    private loggedIn = new BehaviorSubject<boolean>(false); // {1}

    get isLoggedIn() {
        return this.loggedIn.asObservable(); // {2}
    }

    constructor(public jwtHelper: _JwtHelperService, private router: Router, private http: HttpClient) {
    }

    // ...
    public isAuthenticated(): boolean {

        const token = localStorage.getItem('token');

        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }

/*    login(username: string, password: string) {
        console.log('AuthService login()');

        if (username !== '' && password !== '') { // {3}
            this.loggedIn.next(true);
            this.router.navigate(['/']);
        }
        return new User(username, password);
    }*/

    login(username: string, password: string) {
        console.log('AuthenticationService login()');

        return this.http.post<any>(`localhost:8080/users/authenticate`, {username: username, password: password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.loggedIn.next(true);
                    this.router.navigate(['/']);
                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

    logout() {                            // {4}
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
}
