import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { User } from '../../login/login.interface';
import { LoginService } from '../../login/loginservice';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { roleType } from '../../shared/globalConstants';
import { SharedService } from '../../shared/shared.service';
import { UserCart } from '../cart/userCart.model';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class UserLoginComponent implements OnInit {
  user: User;
  invalidUser: boolean = false;
  eventsSubject: Subject<void> = new Subject<void>();
  userCart: UserCart;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.userCart = new UserCart();
  }

  signIn(): void {

    if (this.user.email != "" && this.user.password != "") {
      this.user.roleId = roleType.User;
      this.ngxService.start();
      this.loginService.login(this.user).subscribe(
        userResponse => {
          this.ngxService.stop();

          if (
            userResponse.body != null &&
            userResponse.body.token != null &&
            userResponse.body.token != ""
          ) {

            localStorage.setItem("usertoken", userResponse.body.token);
            this.sharedService.setLocalStorage("customerInfo", userResponse.body);
            this.sharedService.setValue(true);
            // this.sharedService.setCartValue(true);
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
