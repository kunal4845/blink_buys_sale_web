import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { RegisterComponent } from './login/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "login", component: LoginComponent }, 
      { path: "resetPassword", component: ResetPasswordComponent },
       { path: "register", component: RegisterComponent },
      //  { path: "login", component: LoginComponent },
      //  { path: "login", component: LoginComponent },
      //  { path: "login", component: LoginComponent },
      //  { path: "login", component: LoginComponent },
      //  { path: "login", component: LoginComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
