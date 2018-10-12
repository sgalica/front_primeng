import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CoreMenuComponent, CoreSubMenuComponent} from './components/core-menu/core-menu.component';

import {ScrollPanelModule} from 'primeng/scrollpanel';
import {CoreFooterComponent} from './components/core-footer/core-footer.component';
import {CoreProfileComponent} from './components/core-profile/core-profile.component';
import {CoreTopBarComponent} from './components/core-topbar/core-topbar.component';

@NgModule({
    imports: [
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,

        // PrimeNG
        ScrollPanelModule,
    ],
    declarations: [
        CoreMenuComponent,
        CoreSubMenuComponent,
        CoreFooterComponent,
        CoreProfileComponent,
        CoreTopBarComponent,
    ],
    exports: [
        // Modules
        BrowserAnimationsModule,

        // PrimeNG
        ScrollPanelModule,

        // Components
        CoreMenuComponent,
        CoreSubMenuComponent,
        CoreFooterComponent,
        CoreProfileComponent,
        CoreTopBarComponent,
    ],
    providers: [
    ]
})
export class CoreModule { }
