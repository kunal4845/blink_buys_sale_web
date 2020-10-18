import { Component, OnInit } from '@angular/core';
import { User } from '../login.interface';
import { Router } from '@angular/router';
import { LoginService } from '../loginservice';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { SharedService } from 'src/app/shared/shared.service';
import { roleType } from 'src/app/shared/globalConstants';
@Component({
  selector: 'app-service-provider-reset-password',
  templateUrl: './service-provider-reset-password.component.html',
  styleUrls: ['./service-provider-reset-password.component.scss']
})
export class ServiceProviderResetPasswordComponent implements OnInit {

  user: User;
  spinner: boolean = false;
  isPasswordReset: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService) {
    this.user = new User();
  }

  ngOnInit() { }

  recoverPassword(): void {
    this.spinner = true;
    if (this.user.email != "" && this.user.email != null) {
      this.user.roleId = roleType.ServiceProvider;
      this.loginService.resetPassword(this.user.email, roleType.ServiceProvider).subscribe(
        response => {
          this.user = new User();
          this.spinner = false;
          this.isPasswordReset = true;
        },
        error => {
          this.spinner = false; this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('Error', "Please check you email!", 'error', false);
    }
  }
}