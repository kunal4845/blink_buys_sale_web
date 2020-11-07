import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { roleType } from 'src/app/shared/globalConstants';
import { SharedService } from 'src/app/shared/shared.service';
import { User } from '../login.interface';
import { LoginService } from '../loginservice';

@Component({
  selector: 'app-service-provider-login',
  templateUrl: './service-provider-login.component.html',
  styleUrls: ['./service-provider-login.component.scss']
})
export class ServiceProviderLoginComponent implements OnInit {
  login: FormGroup;
  emailPattern = /\S+@\S+\.\S+/;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  user: User;
  invalidUser: boolean = false;

  constructor(private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService
  ) {
    this.user = new User();
  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.user.email != "" && this.user.password != "") {
      this.ngxService.start();
      this.user.roleId = roleType.ServiceProvider;
      this.loginService.login(this.user).subscribe(
        userResponse => {
          if (
            userResponse.body != null &&
            userResponse.body.token != null &&
            userResponse.body.token != ""
          ) {
            localStorage.setItem("token", userResponse.body.token);
            this.sharedService.setLocalStorage("userInfo", userResponse.body);
            this.router.navigateByUrl("/admin/dashboard");
          };
          this.ngxService.stop();
        },
        error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', 'Something went wrong, please try again!!', 'error', false);
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('Warning', "Please provide the valid credentials!", 'warn', false);
    }
  }
}
