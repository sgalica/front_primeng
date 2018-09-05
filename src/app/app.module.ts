import {InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';

import {AppComponent} from './components/app/app.component';
import {LoginComponent} from './login/login.component';
import {AlertComponent} from './alert/alert.component';

import {CarService} from './demo/service/carservice';
import {CountryService} from './demo/service/countryservice';
import {EventService} from './demo/service/eventservice';
import {NodeService} from './demo/service/nodeservice';
import {AppDashboardComponent} from './components/app-dashboard/app-dashboard.component';
import {CoreModule} from '../core/core.module';
import {AppCustomerComponent} from './components/app-customer/app-customer.component';
import {ChartsComponent} from './components/charts/charts.component';


import {SharedModule} from '../shared/shared.module';
import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {DashboardDemoComponent} from '../app/demo/view/dashboarddemo.component';
import {SampleDemoComponent} from '../app/demo/view/sampledemo.component';
import {FormsDemoComponent} from '../app/demo/view/formsdemo.component';
import {DataDemoComponent} from '../app/demo/view/datademo.component';
import {PanelsDemoComponent} from '../app/demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from '../app/demo/view/overlaysdemo.component';
import {MenusDemoComponent} from '../app/demo/view/menusdemo.component';
import {MessagesDemoComponent} from '../app/demo/view/messagesdemo.component';
import {MiscDemoComponent} from '../app/demo/view/miscdemo.component';
import {ChartsDemoComponent} from '../app/demo/view/chartsdemo.component';
import {EmptyDemoComponent} from '../app/demo/view/emptydemo.component';
import {FileDemoComponent} from '../app/demo/view/filedemo.component';
import {UtilsDemoComponent} from '../app/demo/view/utilsdemo.component';
import {DocumentationComponent} from '../app/demo/view/documentation.component';
import {CollaborateursComponent} from './collaborateurs/collaborateurs.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

// used to create fake backend
import {fakeBackendProvider} from './demo/service/fake-backend';
import {JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';

import {AuthGuard} from './demo/service/auth.guard';
import {JwtInterceptor} from './demo/service/jwt.interceptor';
import {ErrorInterceptor} from './demo/service/error.interceptor';
import {AlertService} from './demo/service/alert.service';
import {AuthenticationService} from './demo/service/authentication.service';
import {UserService} from './demo/service/user.service';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';


import {
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ColorPickerModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    ScrollPanelModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule
} from 'primeng/primeng';

import {PrestationsComponent} from './prestations/prestations.component';
import {MenuComponent} from './menu/menu.component';
import {AuthService} from './demo/service/auth.service';
import {CollaborateurService} from './demo/service/collaborateur.service';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    imports: [
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['localhost:3001'],
                blacklistedRoutes: ['localhost:3001/auth/']
            }
            }),
        ReactiveFormsModule,
        FormsModule,
        OrderListModule,
        PickListModule,
        BrowserModule,
        AppRoutes,
        CoreModule,
        SharedModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ColorPickerModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DataViewModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        JwtModule
    ],
    declarations: [
        DashboardDemoComponent,
        SampleDemoComponent,
        FormsDemoComponent,
        DataDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        UtilsDemoComponent,
        DocumentationComponent,
        DashboardDemoComponent,
        AppComponent,
        AppDashboardComponent,
        AppCustomerComponent,
        ChartsComponent,
        CollaborateursComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        HomeComponent,
        PrestationsComponent,
        MenuComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        CarService, CountryService, EventService, NodeService, AuthGuard,
        AlertService,
        CollaborateurService,
        AuthenticationService, AuthService,
        UserService, JwtHelperService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
