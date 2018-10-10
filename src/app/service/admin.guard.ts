// src/app/auth/admin.guard.ts
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthGuard} from "./auth.guard";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        private auth: AuthGuard,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (AuthGuard.isAdmin) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }

}
