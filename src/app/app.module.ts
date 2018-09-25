import {InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';

import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
import {NewCollaborateurComponent} from './component/newCollaborateur/newCollaborateur.component';
import {AlertComponent} from './component/alert/alert.component';

import {EventService} from './service/eventservice';
import {AppDashboardComponent} from './component/app-dashboard/app-dashboard.component';
import {CoreModule} from '../core/core.module';
import {ChartsComponent} from './component/charts/charts.component';


import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';

import {CollaborateursComponent} from './component/collaborateurs/collaborateurs.component';
import {RegisterComponent} from './component/register/register.component';
import {HomeComponent} from './component/home/home.component';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

// used to create fake backend
import {fakeBackendProvider} from './service/fake-backend';
import {JwtHelperService, JwtModule, JwtModuleOptions} from '@auth0/angular-jwt';

import {AuthGuard} from './service/auth.guard';
import {JwtInterceptor} from './service/jwt.interceptor';
import {ErrorInterceptor} from './service/error.interceptor';
import {AlertService} from './service/alert.service';
import {UserService} from './service/user.service';
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

import {PrestationsComponent} from './component/prestations/prestations.component';
import {MenuComponent} from './component/menu/menu.component';
import {AuthService} from './service/auth.service';
import {CollaborateurService} from './service/collaborateur.service';
import {PrestationService} from "./service/prestation.service";

export function tokenGetter() {
    return localStorage.getItem('accessToken');
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
        ReactiveFormsModule,
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
        AppComponent,
        AppDashboardComponent,
        ChartsComponent,
        CollaborateursComponent,
        LoginComponent,
        NewCollaborateurComponent,
        RegisterComponent,
        AlertComponent,
        HomeComponent,
        PrestationsComponent,
        MenuComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        EventService,
        AuthGuard,
        AlertService,
        CollaborateurService,
        PrestationService,
        AuthService,
        UserService, JwtHelperService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
