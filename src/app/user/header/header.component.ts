import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../admin/products/product.model';
import { User } from '../../login/login.interface';
import { SharedService } from '../../shared/shared.service';
import { LoginService } from '../../login/loginservice';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isOpen: boolean = false;
  isLoggedIn: boolean;
  productList: Product[] = [];
  eventsSubject: Subject<void> = new Subject<void>();
  unsubscribe$: Subject<boolean> = new Subject();
  user: User;

  constructor(private sharedService: SharedService,
    private userService: LoginService,
    private router: Router,
    private sweetAlertService: SweetAlertService,) {
    debugger
    this.user = new User();
    if (this.sharedService.getLocalStorage("userInfo")) {
      debugger
      this.user = this.sharedService.getLocalStorage("userInfo");
      this.getUser(this.user.email);
    };

  }

  getUser(email: string) {
    this.userService.getUserByUserName(email).subscribe(
      userResponse => {
        this.isLoggedIn = true;
        debugger
      }
    );
  }

  ngOnInit(): void {
    this.sharedService.getValue().subscribe((res: any) => {
      debugger;
      if (res !== undefined || res !== null) {
        if (res) {
          this.user = this.sharedService.getLocalStorage("userInfo");
          this.getUser(this.user.email);
        }
        this.isLoggedIn = res;
      }
    });
  }

  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    this.router.navigateByUrl("/user/dashboard");
    this.sharedService.setValue(false);
    this.sweetAlertService.sweetAlert('', "Logout successfully!", 'info', false);
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    this.eventsSubject.next();
    $('#cartModal').modal('show');
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

}
