import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/loginservice';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthGuard } from "./shared/authguard/AuthGuard";
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
// import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { UserModule } from './user/user.module';
import { CommonComponentModule } from './shared/common/commonComponent.module';
import { NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION, NgxUiLoaderModule } from 'ngx-ui-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceProviderRegisterComponent } from './login/service-provider-register/service-provider-register.component';
import { FormatTitlePipe } from './shared/format-title.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ServiceProviderLoginComponent } from './login/service-provider-login/service-provider-login.component';
import { DealerLoginComponent } from './login/dealer-login/dealer-login.component';
import { ServiceProviderResetPasswordComponent } from './login/service-provider-reset-password/service-provider-reset-password.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ServiceProviderRegisterComponent,
    FormatTitlePipe,
    ServiceProviderLoginComponent,
    DealerLoginComponent,
    ServiceProviderResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    // RecaptchaModule,  //this is the recaptcha main module
    // RecaptchaFormsModule, //this is the module for form incase form validation
    UserModule,
    CommonComponentModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularMultiSelectModule
  ],
  providers: [
    LoginService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
