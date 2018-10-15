// src/app/auth/admin.guard.ts
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthGuard} from "./auth.guard";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class AdminGuard implements CanActivate {
    private token: string;


    constructor(
        private router: Router
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.isAdmin) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
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
