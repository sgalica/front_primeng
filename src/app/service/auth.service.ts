///<reference path="auth.guard.ts"/>
// src/app/auth/auth.service.ts

import {Injectable} from '@angular/core';
import {JwtHelperService as _JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable, Subject} from 'rxjs-compat/index';
import {User} from '../model/user';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {AuthGuard} from './auth.guard';


export const JwtHelperService = {
    provide: _JwtHelperService,
    useFactory: () => {
        return new _JwtHelperService();
    }
};

@Injectable()
export class AuthService {

    static loggedIn = new Observable<boolean>(); // {1}
    itemValue = new Subject();


    constructor(public jwtHelper: _JwtHelperService, private router: Router, private http: HttpClient, private authGuard: AuthGuard) {

    }


    get isLoggedIn() {
        AuthService.loggedIn = this.authGuard.isLoggedIn;

        return AuthService.loggedIn; // {2}
    }


    login(username: string, password: string) {


        return this.http.post<any>(`/api/auth/signin`, {usernameOrEmail: username, password: password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes

                    localStorage.setItem('currentUser', JSON.stringify(user));

                    AuthGuard.logged.next(true);


                    this.router.navigate(['/']);
                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

    logout() {                            // {4}

        AuthGuard.logged.next(false);
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');


        this.router.navigate(['/login']);
    }


    getProfile() {

        return this.http.get<any>(`/api/user/me`)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    AuthGuard.logged.next(true);

                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

}
