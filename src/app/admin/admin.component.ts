import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/loginservice';
import { SweetAlertService } from '../shared/alert/sweetalert.service';
import { DOCUMENT } from '@angular/common';
import { User } from '../login/login.interface';
import { roleType } from '../shared/globalConstants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  name: string = '';
  user = new User();
  role: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    @Inject(DOCUMENT) private document: Document
  ) {
    document.styleSheets[11].disabled = true; //disable user css for not affecting admin css
    //check user logged in
    // var userinfo = this.sharedService.getLocalStorage("userInfo");
    // if (userinfo != null && userinfo.name != null && userinfo.name != '') {
    //   this.name = userinfo.name;
    //   this.user = userinfo;
    // } else {
    //   this.getUser();
    // }
    this.getUser();
  }

  getUser(): void {
    this.loginService.getUser().subscribe(
      userResponse => {
        this.user = userResponse.body;
        if (this.user.roleId === roleType.Dealer) {
          this.role = 'Dealer';
        } else if (this.user.roleId === roleType.ServiceProvider) {
          this.role = 'Service Provider';
        } else if (this.user.roleId === roleType.Admin) {
          this.role = 'Admin';
        }
        this.name = userResponse.body.name;
      },
      error => {
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }

  logoutUser() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    if (this.role == 'Dealer') {
      this.router.navigateByUrl("/dealer-login");
    }
    else if (this.role == 'Service Provider') {
      this.router.navigateByUrl("/service-provider-login");
    }
    else if (this.role == 'Admin') {
      this.router.navigateByUrl("/admin-login");
    }
  }
}
