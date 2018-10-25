import {Component} from '@angular/core';
import {AppComponent} from '../../../app/app.component';
import {User} from "../../../app/model/user";
import {AuthService} from "../../../app/service/auth.service";
import {first} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'core-topbar',
    templateUrl: './core-topbar.component.html',
    styleUrls: ['./core-topbar.component.css'],

})
export class CoreTopBarComponent {

    isAdmin$ = new BehaviorSubject<boolean>(false); // {1}


    active: boolean;
    currentUser: User;
    firstLetter: string;

    constructor(public app: AppComponent,private auth: AuthService) {

        this.auth.getProfile()
            .pipe().subscribe();

        this.auth.itemValue.subscribe(nextValue => {
            this.currentUser = nextValue as User;
        });
    }

        ngOnInit(): void {


        if (localStorage.getItem('currentUser')) {
            this.auth.isAdmin.subscribe((value) => {
                this.isAdmin$.next(value);
            });

            this.auth.getProfile().pipe(first()).subscribe(x => {


                //this.firstLetter = x.firstname.substr(0,1)+ x.lastname.substr(0,1);
                this.firstLetter = x.firstname.charAt(0).toUpperCase() + x.lastname.charAt(0).toUpperCase();

            });

            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));


        } else {
            this.currentUser = null;
        }


    }

    onClick(event) {

        this.active = !this.active;
        event.preventDefault();
    }


}
