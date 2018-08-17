import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routes';

import { AppComponent } from './components/app/app.component';

import { CarService } from './demo/service/carservice';
import { CountryService } from './demo/service/countryservice';
import { EventService } from './demo/service/eventservice';
import { NodeService } from './demo/service/nodeservice';
import { AppDashboardComponent } from './components/app-dashboard/app-dashboard.component';
import { CoreModule } from '../core/core.module';
import { DemoModule } from '../demo/demo.module';
import { AppCustomerComponent } from './components/app-customer/app-customer.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutes,
        CoreModule,
        DemoModule,
    ],
    declarations: [
        AppComponent,
        AppDashboardComponent,
        AppCustomerComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        CarService, CountryService, EventService, NodeService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
