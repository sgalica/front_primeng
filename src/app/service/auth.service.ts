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
        console.log('[auth.service.ts]', AuthService.loggedIn);
    }


    get isLoggedIn() {
        AuthService.loggedIn = this.authGuard.isLoggedIn;
        console.log('[auth.service.ts] on verifie si on est connecté ', this.authGuard.isLoggedIn);
        return AuthService.loggedIn; // {2}
    }


    login(username: string, password: string) {
        console.log('[auth.service.ts] AuthenticationService login()');

        return this.http.post<any>(`http://localhost:8080/api/auth/signin`, {usernameOrEmail: username, password: password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    console.log('[auth.service.ts] on enregistre le user dans le cookie');
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    AuthGuard.logged.next(true);
                    console.log('[auth.service.ts] on change la valeur a true de LOGGEDIN', AuthGuard.logged.getValue());

                    this.router.navigate(['/']);
                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

    logout() {                            // {4}
        console.log('[auth.service.ts] on se deconnecte', AuthService.loggedIn);

        AuthGuard.logged.next(false);
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        console.log('[auth.service.ts] on est deconnecté', AuthService.loggedIn);

        console.log('[auth.service.ts] on affiche le form login');

        this.router.navigate(['/login']);
    }


    getProfile() {
        console.log('[auth.service.ts] AuthenticationService getprofile()');

        return this.http.get<any>(`http://localhost:5000/api/user/me`)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    console.log('[auth.service.ts] on enregistre le user dans le cookie');
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    AuthGuard.logged.next(true);
                    console.log('[auth.service.ts] on change la valeur a true de LOGGEDIN', AuthGuard.logged.getValue());

                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

}
