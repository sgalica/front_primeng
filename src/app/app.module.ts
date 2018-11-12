import {
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ColorPickerModule,
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
    InputTextareaModule,
    InputTextModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenubarModule,
    MenuModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelMenuModule,
    PanelModule,
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
    TreeTableModule,
} from 'primeng/primeng';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutes} from './app.routes';

import {AppComponent} from './app.component';
import {LoginComponent} from './component/login/login.component';
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

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';

import {AuthGuard} from './service/auth.guard';
import {JwtInterceptor} from './service/jwt.interceptor';
import {ErrorInterceptor} from './service/error.interceptor';
import {AlertService} from './service/alert.service';
import {UserService} from './service/user.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PrestationsComponent} from './component/prestations/prestations.component';
import {MenuComponent} from './component/menu/menu.component';
import {AuthService} from './service/auth.service';
import {NewsComponent} from './news/news.component';
import {AdministratorComponent} from "./administrator/administrator.component";
// import {AdminGuard} from "./service/admin.guard";
import {NotFoundComponent} from './not-found/not-found.component';
import {DataService} from "./service/data.service";
import {
    CategorieService,
    CollaborateurService,
    CommercialOpenService,
    ContactsSttService,
    ContratService,
    DonneurOrdreService,
    EquipeService,
    MissionService,
    NumAtgService,
    PrestationService,
    ReferencielService,
    SiteService,
    SocieteSttService
} from "./service/datas.service";
import {DatePipe} from "@angular/common";

// used to create fake backend


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
        AdministratorComponent,
        AppComponent,
        AppDashboardComponent,
        ChartsComponent,
        CollaborateursComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,
        HomeComponent,
        PrestationsComponent,
        MenuComponent,
        NewsComponent,
        NotFoundComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        EventService,
        AuthGuard,
        //AdminGuard,
        AlertService,
        CollaborateurService,
        DataService,
        ReferencielService,
        NumAtgService,
        MissionService,
        PrestationService,
        AuthService,
        NumAtgService,
        ContactsSttService,
        ContratService,
        SocieteSttService,
        PrestationService,
        EquipeService,
        DonneurOrdreService,
        CategorieService,
        CommercialOpenService,
        DatePipe,
        SiteService,
        MissionService,
        UserService,
        JwtHelperService,
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    entryComponents: [AppDashboardComponent],


    bootstrap: [AppComponent]
})
export class AppModule {
}
