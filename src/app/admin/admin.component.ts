import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoginService } from '../login/loginservice';
import { SweetAlertService } from '../shared/alert/sweetalert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  name: string = '';
  constructor(private router: Router, private sharedService: SharedService, private loginService: LoginService,
    private sweetAlertService: SweetAlertService) {
    debugger;
    
    document.styleSheets[0].disabled = true;
    document.styleSheets[1].disabled = true;
    document.styleSheets[2].disabled = true;
    document.styleSheets[3].disabled = true;
    document.styleSheets[4].disabled = true;
    document.styleSheets[5].disabled = true;
    document.styleSheets[6].disabled = true;
    document.styleSheets[7].disabled = true;
    document.styleSheets[8].disabled = true;
    document.styleSheets[9].disabled = true;
    document.styleSheets[10].disabled = true;


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
    debugger;
    this.loginService.getUser().subscribe(
      userResponse => {
        debugger;
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
