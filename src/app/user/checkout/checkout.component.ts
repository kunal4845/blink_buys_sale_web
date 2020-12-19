import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { SharedService } from '../../shared/shared.service';
import { Product } from '../../admin/products/product.model';
import { User } from '../../login/login.interface';
import { CartService } from '../cart/cart.service';
import { UserCart } from '../cart/userCart.model';
import { BillingAddress } from './billingAddress.model';
import { CartType } from 'src/app/shared/globalConstants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  productList: Product[] = [];
  userCarts: UserCart[] = [];
  user: User;
  totalCost: number = 0;
  billingAddress: BillingAddress;
  cartCount: number = 0;

  constructor(
    private cartService: CartService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {
    this.user = new User();
    this.billingAddress = new BillingAddress();

    this.sharedService.isChangeDetected().subscribe((res: any) => {
      debugger
      if (res != undefined || res != null) {
        if (res) {
          this.getCartDetails();
        }
      }
    });

  }

  ngOnInit(): void {
    debugger
    if (this.sharedService.getLocalStorage("customerInfo") === undefined || this.sharedService.getLocalStorage("customerInfo") === null) {
      this.router.navigateByUrl("/user/login");
    } else {
      this.getBillingAddress();
      this.getCartDetails();
    }
  }

  getBillingAddress() {
    this.ngxService.start();
    this.billingAddress.createdDt = new Date();
    this.cartService.getBillingAddress().subscribe(
      res => {
        this.billingAddress = res.body;
        this.ngxService.stop();
      }, error => {
        this.ngxService.stop();
      }
    );
  }

  makePayment(form: NgForm) {
    if (form.invalid) {
      this.sweetAlertService.sweetAlert('', 'Please provide the delivery address above!', 'warn', false);
      return;
    }
    this.router.navigateByUrl("/user/payment");
  }

  addBillingAddress() {

    this.ngxService.start();
    this.billingAddress.createdDt = new Date();
    this.cartService.addBillingAddress(this.billingAddress).subscribe(
      userResponse => {

        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', 'Address updated successfully!', 'success', false);
      }, error => {
        this.ngxService.stop();
      }
    );
  }

  getCartDetails() {
    this.totalCost = 0;
    this.ngxService.start();
    this.cartService.getCart().subscribe(
      res => {

        this.userCarts = res.body;
        for (let data of this.userCarts) {
          if (data.type == CartType.Product) {
            this.totalCost += data.product.price * data.quantity;
          } else {
            this.totalCost += data.service.price * data.quantity;
          }
          this.cartCount = this.cartCount + data.quantity;
        }
        this.ngxService.stop();
      }, error => {
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
        this.cartCount = this.cartCount + 1;
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
          this.cartCount = this.cartCount - 1;
        });
    }
  }

  delete(cart: UserCart, i: number) {
    this.ngxService.start();
    this.cartService.deleteCart(cart.id).subscribe(
      res => {
        debugger
        this.ngxService.stop();
        this.userCarts.splice(i, 1);
        this.sharedService.setCartValue(-1);
        this.cartCount = this.cartCount - 1;
        this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Removed successfully!' });

      }, error => {
        this.ngxService.stop();
      });
  }
}
