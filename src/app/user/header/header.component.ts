import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Product } from '../../admin/products/product.model';
import { User } from '../../login/login.interface';
import { SharedService } from '../../shared/shared.service';
import { LoginService } from '../../login/loginservice';
import { Router } from '@angular/router';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CartService } from '../cart/cart.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  eventsSubject: Subject<void> = new Subject<void>();
  unsubscribe$: Subject<boolean> = new Subject();

  isOpen: boolean = false;
  isLoggedIn: boolean;
  productList: Product[] = [];
  user: User;
  cartCount: number = 0;

  constructor(private sharedService: SharedService,
    private userService: LoginService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService) {
    this.user = new User();
    if (this.sharedService.getLocalStorage("userInfo")) {
      this.user = this.sharedService.getLocalStorage("userInfo");
      this.getUser(this.user.email);
    };
  }

  ngOnInit(): void {
    this.sharedService.getValue().subscribe((res: any) => {
      if (res !== undefined || res !== null) {
        if (res) {
          this.user = this.sharedService.getLocalStorage("userInfo");
          this.getUser(this.user.email);
        }
        this.isLoggedIn = res;
      }
    });
    this.getCartDetails();
  }

  getUser(email: string) {
    this.userService.getUserByUserName(email, this.user.roleId).subscribe(
      userResponse => {
        this.isLoggedIn = true;
      }
    );
  }

  getCartDetails() {
    this.user = this.sharedService.getLocalStorage("userInfo");
    if (this.user) {
      this.cartService.getCart(this.user.id).subscribe(
        (res) => {
          this.cartCount = res.body.length;
        });
    }
  }



  logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    this.router.navigateByUrl("/user/dashboard");
    this.sharedService.setValue(false);
    this.sweetAlertService.sweetAlert('', "Logout successfully!", '', false);
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  openCart() {
    this.eventsSubject.next();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
