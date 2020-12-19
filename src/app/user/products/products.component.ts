import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/login/login.interface';
import { LoginService } from 'src/app/login/loginservice';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CartType } from 'src/app/shared/globalConstants';
import { SharedService } from 'src/app/shared/shared.service';
import { CategoryModel } from '../../admin/category/category.model';
import { Product } from '../../admin/products/product.model';
import { ProductService } from '../../admin/products/product.service';
import { CartService } from '../cart/cart.service';
import { UserCart } from '../cart/userCart.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  isOpen: boolean = false;
  productList: Product[] = [];
  tempProductList: Product[] = [];
  userCart: UserCart;
  user: User;

  issSelected_25000: boolean = false;
  issSelected_10000: boolean = false;
  issSelected_5000: boolean = false;
  issSelected_2000: boolean = false;
  issSelected_1000: boolean = false;
  issSelected_500: boolean = false;
  moreSelected: boolean = false;

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private messageService: MessageService,
    private cartService: CartService,
    private router: Router,
    private userService: LoginService,
    private sharedService: SharedService
  ) {
    this.userCart = new UserCart();
    this.user = new User();
    this.getProductList();
  }

  ngOnInit(): void {
    
    //check if user logged in
    if (this.sharedService.getLocalStorage("customerInfo") != null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {
      this.getUser();
    };
  }

  getUser() {
    this.userService.getUser().subscribe(
      userResponse => {
        this.user = userResponse.body;
      }
    );
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  getProductList() {
    this.ngxService.start();
    this.productService.getDashoboardProductList().subscribe(
      res => {
        
        this.productList = res.body.filter(x => !x.isDeleted && x.isActive && x.isVerified);
        this.tempProductList = res.body.filter(x => !x.isDeleted && x.isActive && x.isVerified);

        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  checkWhichCheckboxSelected() {
    if (this.moreSelected) {
      this.productList = this.tempProductList.sort((a, b) => b.price - a.price); // For descending sort
    }
    else if (this.issSelected_25000) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 25000);
    }
    else if (this.issSelected_10000) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 10000);
    }
    else if (this.issSelected_5000) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 5000);
    }
    else if (this.issSelected_2000) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 2000);
    }
    else if (this.issSelected_1000) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 1000);
    }
    else if (this.issSelected_500) {
      this.productList = this.tempProductList.filter(x => !x.isDeleted && x.isActive && x.price <= 500);
    } else {
      this.productList = this.tempProductList.sort((a, b) => a.price - b.price); // For descending sort
    }
  }

  sortByPrice(price: string) {
    
    if (price == 'more') {
      this.moreSelected = !this.moreSelected;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '25000') {
      this.issSelected_25000 = !this.issSelected_25000;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '10000') {
      this.issSelected_10000 = !this.issSelected_10000;
      this.checkWhichCheckboxSelected()
    }

    else if (price == '5000') {
      this.issSelected_5000 = !this.issSelected_5000;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '2000') {
      this.issSelected_2000 = !this.issSelected_2000;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '1000') {
      this.issSelected_1000 = !this.issSelected_1000;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '500') {
      this.issSelected_500 = !this.issSelected_500;
      this.checkWhichCheckboxSelected()
    }
    else if (price == 'high') {
      this.productList = this.tempProductList.sort((a, b) => b.price - a.price); // For descending sort
    }
    else if (price == 'low') {
      this.productList = this.tempProductList.sort((a, b) => a.price - b.price); // For asc sort
    }
    else if (price == 'latest') { // For latest sort
      this.productList = this.tempProductList.sort((a: Product, b: Product) => {
        return this.getTime(b.createdDt) - this.getTime(a.createdDt);
      });
    }
  }

  addToCart(product: Product) {
    
    if (this.user.id > 0) {

      this.userCart.isDeleted = false;
      this.userCart.bookedItemId = product.id;
      this.userCart.quantity = product.quantity + 1;
      this.userCart.userId = this.user.id;
      this.userCart.type = CartType.Product;

      this.ngxService.start();
      this.cartService.addToCart(this.userCart).subscribe(
        res => {
          this.ngxService.stop();
          this.sharedService.setCartValue(1);
          this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Added to cart successfully!' });
        },
        error => {
          this.ngxService.stop();
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('', "Login or register for adding item in cart!", 'info', false);
    }
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime()
      : 0;
  }
}
