import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs/Rx';

import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable()
export class AuthGuard implements CanActivate {

    static logged = new BehaviorSubject<boolean>(false); // {1}
    static admin = new BehaviorSubject<boolean>(false); // {1}

    token: any;

    constructor(private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        //const expectedRole = route.data.expectedRole;


        const url: string = state.url;


        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {

        // debugger
        if (!AuthGuard.logged.getValue()) {
            this.router.navigate([ '/login' ]);
            return false;
        } else if (AuthGuard.logged.getValue()) {
            return true;
        }
    }

    get isLoggedIn(): Observable<boolean> {


        if (localStorage.getItem('currentUser')) {

            // const tokenPayload = jwt_decode(JSON.parse(this.token).accessToken);


            /* // this will be passed from the route config
             // on the data property
             const token = localStorage.getItem('accessToken');
             // decode the token to get its payload
             const tokenPayload = decode(token);
             console.log("USER ROLE :::::::::::::::::::::", token);*/
            AuthGuard.logged.next(true);
        } else {
            AuthGuard.logged.next(false);
        }
        return AuthGuard.logged.asObservable();
    }

    get isAdmin(): Observable<boolean> {

        if (localStorage.getItem('currentUser')) {

            this.token = localStorage.getItem('currentUser');

            const helper = new JwtHelperService();

            const decodedToken = helper.decodeToken(this.token);


            console.log("USER ROLE admin :::::::::::::::::::::", decodedToken.scopes);

            if (decodedToken.scopes.includes("ROLE_ADMIN")){
                AuthGuard.admin.next(true);
                console.log("Le Role ADMIN est il present ? ",decodedToken.scopes.includes("ROLE_ADMIN"));

            } else {
                AuthGuard.admin.next(false);
                console.log("Le Role ADMIN est il present ? ",decodedToken.scopes.includes("ROLE_ADMIN"));

            }


        }
        return AuthGuard.admin.asObservable();
    }
}
