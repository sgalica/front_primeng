import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {AlertService} from '../../service/alert.service';
import {Message} from "primeng/api";

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']

})


export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private subscription2: Subscription;

    msgs: Message[] = [];



    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {

            this.message = message;

        });

        this.subscription2 = this.alertService.getMessage2().subscribe(message2 => {

            this.msgs = message2;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
    }

}
