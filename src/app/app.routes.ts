import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { AppDashboardComponent } from './component/app-dashboard/app-dashboard.component';

import { AppCustomerComponent } from './component/app-customer/app-customer.component';
import { LoginComponent } from './component/login/login.component';
import {NewCollaborateurComponent} from './component/newCollaborateur/newCollaborateur.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './service/auth.guard';
import {CollaborateursComponent} from './component/collaborateurs/collaborateurs.component';
import {PrestationsComponent} from './component/prestations/prestations.component';


export const routes: Routes = [
    {path: '', component: AppDashboardComponent, canActivate: [AuthGuard]},
    {path: 'accueil', component: AppDashboardComponent, canActivate: [AuthGuard]},
    {path: 'customer', component: AppCustomerComponent},

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Demo Routing
    {path: 'collaborateurs', component: CollaborateursComponent, canActivate: [AuthGuard]},
    {path: 'newCollaborateur', component: NewCollaborateurComponent},
    {path: 'prestations', component: PrestationsComponent, canActivate: [AuthGuard]}

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
