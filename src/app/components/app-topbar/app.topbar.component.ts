import { Component } from '@angular/core';
import { AppComponent } from '../app/app.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {

    constructor(public app: AppComponent) { }

}
