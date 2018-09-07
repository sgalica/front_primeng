/*
/!*
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
*!/

import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {log} from 'util';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {
        console.log('on construit le service gard');
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.isLoggedIn         // {1}
            .pipe(
                take(1),                              // {2}
                map((isLoggedIn: boolean) => {
                    console.log("On test si on est connecté : ", isLoggedIn);
// {3}
                    if (!isLoggedIn) {
                        console.log("on n'est pas connecté");

                        this.router.navigate(['/login']);  // {4}
                        return false;
                    }
                    console.log("on est connecté");

                    return true;
                })
            );


    }
}
*/

import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {

    static logged = new BehaviorSubject<boolean>(false); // {1}

    constructor(private router: Router) {         console.log('[auth.guard.ts]');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        console.log('[auth.guard.ts] on veut afficher la page ', url);
        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {
        console.log(' [auth.guard.ts] la valeur de isloggedIn ', AuthGuard.logged.getValue(), this.isLoggedIn);

        // debugger
        if (!AuthGuard.logged.getValue()) {
            console.log(' [auth.guard.ts] on n\'est pas loggé', AuthGuard.logged.getValue(), this.isLoggedIn);
            this.router.navigate(['/login']);
            return false;
        } else if (AuthGuard.logged.getValue()) {
            console.log('[auth.guard.ts] on est bien loggé', AuthGuard.logged.getValue() , this.isLoggedIn );

            return true;
        }
    }
    get isLoggedIn(): Observable<boolean> {

        if ( localStorage.getItem('currentUser') ) {
            AuthGuard.logged.next(true);
        } else {
            AuthGuard.logged.next(false);
        }
        console.log('[auth.guard.ts] est on loggé ? ', AuthGuard.logged.getValue());
        return AuthGuard.logged.asObservable() ;
    }
}
