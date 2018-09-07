import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject} from "rxjs/Rx";

@Injectable()
export class AuthenticationService {

    itemValue = new Subject();

    constructor(private http: HttpClient) {
    }

    login(username: string, password: string) {
        console.log('AuthenticationService login()');

        return this.http.post<any>(`localhost:8080/users/authenticate`, {username: username, password: password})
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                this.itemValue.next(user); // this will make sure to tell every subscriber about the change.

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
