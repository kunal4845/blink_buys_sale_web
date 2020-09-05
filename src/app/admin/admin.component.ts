import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoginService } from '../login/loginservice';
import { SweetAlertService } from '../shared/alert/sweetalert.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  name: string = '';
  constructor(private router: Router, private sharedService: SharedService, private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    @Inject(DOCUMENT) private document: Document) {    
    document.styleSheets[11].disabled = true;//disable user css for not affecting admin css

    //check user logged in
    var userinfo = this.sharedService.getLocalStorage("userInfo");
    if (userinfo != null && userinfo.name != null && userinfo.name != '') {
      this.name = userinfo.name;
    } else {
      this.getUser();
    }
  }

  ngOnInit() {
  }

  getUser(): void {
    this.loginService.getUser().subscribe(
      userResponse => {
        this.name = userResponse.body.name;
      },
      error => {
        this.sweetAlertService.sweetAlert('Error', error.statusText, 'error', false);
      }
    );
  }

  logoutUser() {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    this.router.navigateByUrl("/login");
  }
}
