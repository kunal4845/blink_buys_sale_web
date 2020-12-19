import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./shared/authguard/AuthGuard";
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { ServiceProviderRegisterComponent } from './login/service-provider-register/service-provider-register.component';
import { ServiceProviderLoginComponent } from './login/service-provider-login/service-provider-login.component';
import { DealerLoginComponent } from './login/dealer-login/dealer-login.component';
import { ServiceProviderResetPasswordComponent } from './login/service-provider-reset-password/service-provider-reset-password.component';

const routes: Routes = [
  {
    path: 'admin-login',
    component: LoginComponent
  },
  {
    path: 'service-provider-register',
    component: ServiceProviderRegisterComponent
  },
  {
    path: 'service-provider-login',
    component: ServiceProviderLoginComponent
  },
  {
    path: 'service-provider-reset-password',
    component: ServiceProviderResetPasswordComponent
  },
  {
    path: 'dealer-login',
    component: DealerLoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'user', loadChildren: () => import('./user/user-routing.module').then(m => m.UserRoutingModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
