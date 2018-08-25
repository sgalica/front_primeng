/*
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
*/

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

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.isLoggedIn         // {1}
            .pipe(
                take(1),                              // {2}
                map((isLoggedIn: boolean) => {         // {3}
                    if (!isLoggedIn) {
                        this.router.navigate(['/login']);  // {4}
                        return false;
                    }
                    return true;
                })
            );


    }
}
