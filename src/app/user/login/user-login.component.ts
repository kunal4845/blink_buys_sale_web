import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { LoginService } from 'src/app/login/loginservice';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { roleType } from 'src/app/shared/globalConstants';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class UserLoginComponent implements OnInit {
  user: User;
  invalidUser: boolean = false;

  constructor(private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.user = new User();
  }

  signIn(): void {
    debugger;
    if (this.user.email != "" && this.user.password != "") {
      this.user.roleId = roleType.User;
      this.ngxService.start();
      this.loginService.login(this.user).subscribe(
        userResponse => {
          this.ngxService.stop();
          debugger
          if (
            userResponse.body != null &&
            userResponse.body.token != null &&
            userResponse.body.token != ""
          ) {
            debugger;
            localStorage.setItem("token", userResponse.body.token);
            this.sharedService.setLocalStorage("userInfo", userResponse.body);
            this.sharedService.setValue(true);
            this.router.navigateByUrl("/user/dashboard");
          }
        },
        error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', "Failed to login, please check you credentials or try to reset you password!", 'error', false);
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('Invalid credentials', "Please check your credentials!", 'info', false);
    }
  }
}
