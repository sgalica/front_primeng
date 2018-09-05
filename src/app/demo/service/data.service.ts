import {Injectable} from '@angular/core';
import {JwtHelperService as _JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable, Subject} from 'rxjs/Rx';
import {User} from './user';
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
export class DataService {


    constructor(public jwtHelper: _JwtHelperService, private router: Router, private http: HttpClient, private authGuard: AuthGuard) {
        console.log('[data.service.ts]');
    }




    collaborateurs(username: string, password: string) {
        console.log('[auth.service.ts] AuthenticationService login()');

        return this.http.post<any>(`localhost:9090/collaborateur`, {username: username, password: password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    console.log('[auth.service.ts] on enregistre le user dans le cookie');
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    AuthGuard.logged.next(true);
                    console.log('[auth.service.ts] on change la valeur a true de LOGGEDIN', AuthGuard.logged.getValue());

                    this.router.navigate(['/']);
                }

                return user;
            }));
    }

}
