import { Component } from '@angular/core';
import { AppComponent } from '../../../app/app.component';

@Component({
    selector: 'core-topbar',
    templateUrl: './core-topbar.component.html',
})
export class CoreTopBarComponent {

    constructor(public app: AppComponent) { }

}
