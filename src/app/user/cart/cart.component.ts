import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { User } from 'src/app/login/login.interface';
import { LoginService } from 'src/app/login/loginservice';
import { SharedService } from 'src/app/shared/shared.service';
import { CartService } from './cart.service';
import { UserCart } from './userCart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  productList: Product[] = [];
  userCart: UserCart[] = [];
  user: User;

  constructor(private userService: LoginService,
    private cartService: CartService,
    private sharedService: SharedService) {
    this.user = new User();
    this.getCartDetails();
  }

  ngOnInit(): void {
    debugger

    this.eventsSubscription = this.events.subscribe(() => {
      this.getCartDetails();
    });
  }

  customTB(index, cart) { debugger; return `${index}-${cart.id}`; }


  getCartDetails() {
    debugger
    this.user = this.sharedService.getLocalStorage("userInfo");
    if (this.user) {
      this.cartService.getCart(this.user.id).subscribe(
        (res) => {
          debugger
          this.userCart = res.body;
        });
    }
  }

  addMore(cart: UserCart) {
    debugger
    cart.quantity = cart.quantity + 1;
    this.cartService.addToCart(cart).subscribe(
      (res) => {
        debugger
        this.getCartDetails();
      });
  }

  addLess(cart: UserCart) {
    debugger
    cart.quantity = cart.quantity - 1;
    if (cart.quantity === 0) {
      this.delete(cart);
    } else {
      this.cartService.addToCart(cart).subscribe(
        (res) => {
          debugger
          this.getCartDetails();
        });
    }
  }

  delete(cart: UserCart) {
    debugger
    this.cartService.deleteCart(cart.id).subscribe(
      (res) => {
        debugger
        this.getCartDetails();
      });
  }

  checkout() {

  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
