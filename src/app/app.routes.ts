import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { AppDashboardComponent } from './component/app-dashboard/app-dashboard.component';

import { LoginComponent } from './component/login/login.component';
import {NewCollaborateurComponent} from './component/newCollaborateur/newCollaborateur.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './service/auth.guard';
import {CollaborateursComponent} from './component/collaborateurs/collaborateurs.component';
import {PrestationsComponent} from './component/prestations/prestations.component';
import {AdministratorComponent} from "./administrator/administrator.component";
//import {AdminGuard} from "./service/admin.guard";


export const routes: Routes = [
    {path: '', component: AppDashboardComponent, canActivate: [AuthGuard]},
    {path: 'accueil', component: AppDashboardComponent, canActivate: [AuthGuard]},

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    {path: 'collaborateurs', component: CollaborateursComponent, canActivate: [AuthGuard]},
    {path: 'collaborateurs/:id', component: CollaborateursComponent},
    {path: 'newCollaborateur', component: NewCollaborateurComponent, canActivate: [AuthGuard]},
    {path: 'prestations', component: PrestationsComponent, canActivate: [AuthGuard]},
    {path: 'prestations/collab/:idcollab', component: PrestationsComponent, canActivate: [AuthGuard]},

    //{path: 'administration', component: AdministratorComponent, canActivate: [AuthGuard , AdminGuard]},
    {path: 'administration', component: AdministratorComponent, canActivate: [AuthGuard]},

    { path: '**', redirectTo: '' },
    { path: 'error', redirectTo: '' }
     //{ path: '**', component: NotFoundComponent }



];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
