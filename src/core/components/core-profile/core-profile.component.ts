import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {User} from '../../../app/model/user';
import {AuthService} from '../../../app/service/auth.service';
import {first} from "rxjs/operators";
import {BehaviorSubject} from "../../../../node_modules/rxjs/Rx";


@Component({
    selector: 'core-profile',
    templateUrl: './core-profile.component.html',
    styleUrls: ['./core-profile.component.css'],

    animations: [
        trigger('menu', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class CoreProfileComponent implements OnInit {

    isAdmin$ = new BehaviorSubject<boolean>(false); // {1}


    active: boolean;
    currentUser: User;
    firstLetter: string;

    constructor(private auth: AuthService) {

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
