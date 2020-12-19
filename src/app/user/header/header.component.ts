import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../admin/products/product.model';
import { User } from '../../login/login.interface';
import { SharedService } from '../../shared/shared.service';
import { LoginService } from '../../login/loginservice';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { CartService } from '../cart/cart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SiteUrl } from '../../shared/globalConstants';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  isOpen: boolean = false;
  isCategoryOpen: boolean = false;
  isLoggedIn: boolean;
  productList: Product[] = [];
  user: User;
  cartCount: number = 0;

  constructor(
    private sharedService: SharedService,
    private userService: LoginService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService,
    private ngxService: NgxUiLoaderService
  ) {
    this.user = new User();
    if (this.sharedService.getLocalStorage("customerInfo") != null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {
      this.getUser();
      this.getCartDetails();
    };
  }

  ngOnInit(): void {
    $('.header-two').scrollToFixed();

    $('.marquee').marquee({
      speed: 13000,
      gap: 0,
      delayBeforeStart: 0,
      direction: 'left',
      duplicated: true,
      pauseOnHover: true
    });

    this.sharedService.getValue().subscribe((res: any) => {
      if (res != undefined || res != null) {
        if (res) {
          this.isLoggedIn = true;
          this.getUser();
          this.getCartDetails();
        } else {
          this.isLoggedIn = false;
        }
      }
    });

    this.sharedService.getCartValue().subscribe((res: any) => {
      debugger
      if (res != undefined || res != null) {
        if (res) {
          this.cartCount = this.cartCount + res;
        } else {
          this.cartCount = 0;
        }
      }
    });

    this.sharedService.getCarttoZero().subscribe((res: any) => {
      debugger
      if (res != undefined || res != null) {
        if (res == 0) {
          this.cartCount = 0;
        }
      }
    });
  }

  redirectTo(type: string): void {
    if (type === 'admin') {
      var win = window.open(SiteUrl + 'admin-login', '_blank');
    }
    else if (type === 'dealer') {
      var win = window.open(SiteUrl + 'dealer-login', '_blank');
    }
    else if (type === 'serviceProvider') {
      var win = window.open(SiteUrl + 'service-provider-login', '_blank');
    }
  }

  getUser() {
    this.ngxService.start();
    this.userService.getUser().subscribe(
      userResponse => {
        this.ngxService.stop();
        this.isLoggedIn = true;
        this.user = userResponse.body;
      }, error => {
        this.ngxService.stop();
      }
    );
  }

  getCartDetails() {
    this.ngxService.start();
    this.cartService.getCart().subscribe(
      res => {
        this.ngxService.stop();
        res.body.forEach(element => {
          this.cartCount = this.cartCount + element.quantity;
        });
        // this.cartCount = res.body.length;
      }, error => {
        this.ngxService.stop();
      });
  }

  logOut() {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("customerInfo");
    this.router.navigateByUrl("/user/dashboard");
    this.sharedService.setValue(false);
    // this.sharedService.setCartValue(false);
    this.sweetAlertService.sweetAlert('', "Logout successfully!", '', false);
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  openCategoryDropdown() {
    this.isCategoryOpen = !this.isCategoryOpen;

  }

  openCart() {
    this.eventsSubject.next();
  }

  ngOnDestroy() {
    this.sharedService.setCartValue(0);
  }
}
