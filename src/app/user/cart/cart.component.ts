import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { User } from 'src/app/login/login.interface';
import { LoginService } from 'src/app/login/loginservice';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CartService } from './cart.service';
import { UserCart } from './userCart.model';
declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  productList: Product[] = [];
  userCarts: UserCart[] = [];
  user: User;

  constructor(
    private userService: LoginService,
    private cartService: CartService,
    private sharedService: SharedService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private messageService: MessageService
  ) {
    this.user = new User();
    // this.getCartDetails();
    // debugger
    // if (this.sharedService.getLocalStorage("customerInfo") === undefined || this.sharedService.getLocalStorage("customerInfo") === null) {
    //   this.router.navigateByUrl("/user/login");
    // }
  }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe(() => {
      $('#cartModal').modal('show');
      this.getCartDetails();
    });
  }

  getCartDetails() {
    this.ngxService.start();
    this.cartService.getCart().subscribe(
      res => {
        this.ngxService.stop();
        this.userCarts = res.body;
      },
      error => {
        this.ngxService.stop();
      });
  }

  addMore(cart: UserCart) {
    if (cart.quantity == 10) {
      this.sweetAlertService.sweetAlert('', "Can not add more than 10 quantity!", 'warn', false);
      return;
    }
    cart.quantity = cart.quantity + 1;
    this.cartService.addToCart(cart).subscribe(
      res => {
        this.sharedService.setCartValue(1);
        this.sharedService.loadCheckoutInit(true);
      });
  }

  addLess(cart: UserCart, i: number) {
    cart.quantity = cart.quantity - 1;
    if (cart.quantity === 0) {
      this.delete(cart, i);
    } else {
      this.cartService.addToCart(cart).subscribe(
        res => {
          this.sharedService.setCartValue(-1);
          this.sharedService.loadCheckoutInit(true);
        });
    }
  }

  delete(cart: UserCart, i: number) {
    this.cartService.deleteCart(cart.id).subscribe(
      res => {
        this.userCarts.splice(i, 1);
        this.sharedService.setCartValue(-1);
        this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Removed successfully!' });
        this.sharedService.loadCheckoutInit(true);
      });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
