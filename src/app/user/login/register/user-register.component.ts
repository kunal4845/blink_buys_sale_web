import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/login/login.interface';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/loginservice';
import { EMAIL_PATTERN, PASSWORD_PATTERN, roleType } from '../../../shared/globalConstants';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CartService } from '../../cart/cart.service';
import { Subject } from 'rxjs';
import { UserCart } from '../../cart/userCart.model';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  user: User;
  emailPattern = EMAIL_PATTERN;
  passwordPattern = PASSWORD_PATTERN;
  eventsSubject: Subject<void> = new Subject<void>();
  userCart: UserCart;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private userService: LoginService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService
  ) {
    this.user = new User();
    this.userCart = new UserCart();
  }

  ngOnInit(): void {
  }

  register(registerForm: NgForm): void {
    
    if (this.user.email != "" && this.user.password != "" && this.user.confirmPassword != "" && this.user.name != "") {
      this.ngxService.start();
      this.user.roleId = roleType.User;//assign user role
      this.userService.userRegister(this.user).subscribe(
        (userResponse: any) => {
          
          this.ngxService.stop();
          if (userResponse.status === 200) {
            localStorage.setItem("usertoken", userResponse.body.token);
            this.sharedService.setLocalStorage("customerInfo", userResponse.body);
            registerForm.reset();
            this.sharedService.setValue(true);

            this.sweetAlertService.sweetAlert('', "Registered successfully!", 'success', false);
            this.router.navigateByUrl("/user/dashboard");
          }
        },
        error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('', "Registration failed, If you face this issue frequently feel free to write us on contact section!", 'error', false);
        }
      );
    }
    else {
      this.sweetAlertService.sweetAlert('', "Unable to register, Please correct the input details!", 'info', false);
    }
  }
}
