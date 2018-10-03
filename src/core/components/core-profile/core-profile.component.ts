import {Component, OnInit} from '@angular/core';
import {trigger, state, transition, style, animate} from '@angular/animations';
import {User} from '../../../app/model/user';
import {Location} from '@angular/common';
import {AuthService} from '../../../app/service/auth.service';
import {first} from "rxjs/operators";



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



    active: boolean;
    currentUser: User;

    constructor(private auth: AuthService) {

        this.auth.getProfile()
            .pipe(first()).subscribe();

        this.auth.itemValue.subscribe(nextValue => {
            this.currentUser = nextValue as User ;
        });
    }


    ngOnInit(): void {
        if (localStorage.getItem('currentUser')) {
            this.auth.getProfile().pipe(first()).subscribe();

            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log(this.currentUser);
        } else {
            this.currentUser = null;
        }


    }




    onClick(event) {

        this.active = !this.active;
        event.preventDefault();
    }


}
