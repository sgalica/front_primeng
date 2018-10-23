import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(                        private authService: AuthService,
                                        private router: Router,
    ) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
        }

        return next.handle(request)
            .catch((error, caught) => {
                if (error.status === 401) {
                    //logout users, redirect to login page
                    this.authService.logout();
                    //redirect to the signin page or show login modal here
                    this.router.navigate(['/api/auth/signin']); //remember to import router class and declare it in the class
                    return Observable.throw(error);
                } else {
                    return Observable.throw(error);
                }
            }) as any;
    }
}
