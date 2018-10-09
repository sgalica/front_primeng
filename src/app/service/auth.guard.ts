import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs/Rx';
import {decode} from "punycode";
import {log} from "util";

@Injectable()
export class AuthGuard implements CanActivate {

    static logged = new BehaviorSubject<boolean>(false); // {1}

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const expectedRole = route.data.expectedRole;


        const url: string = state.url;


        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {

        // debugger
        if (!AuthGuard.logged.getValue()) {
            this.router.navigate(['/login']);
            return false;
        } else if (AuthGuard.logged.getValue()) {
            return true;
        }
    }

    get isLoggedIn(): Observable<boolean> {



        if (localStorage.getItem('currentUser')) {

            // this will be passed from the route config
            // on the data property
            const token = localStorage.getItem('accessToken');
            // decode the token to get its payload
            const tokenPayload = decode(token);
            console.log("USER ROLE :::::::::::::::::::::", token);
            AuthGuard.logged.next(true);
        } else {
            AuthGuard.logged.next(false);
        }
        return AuthGuard.logged.asObservable();
    }
}
