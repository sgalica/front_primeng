/*
import {
    Injectable
} from '@angular/core';
import {
    CanActivate,
    Router
} from '@angular/router';

@Injectable()
export class AdminIsLoggedInGuard implements CanActivate {

    constructor(private router: Router,private adminservice: AdminService) {}

    canActivate() {
        if (this.adminservice.AdminIsLoggedIn()) {
            return true;
        } else {
            alert("U mag deze pagina niet bezichtigen");
            this.router.navigate(['/']);
            return false;
        }
    }

}
*/
