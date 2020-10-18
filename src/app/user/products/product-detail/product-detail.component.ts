import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subject, Subscription } from 'rxjs';
import { Product } from '../../../admin/products/product.model';
import { ProductService } from '../../../admin/products/product.service';
import { User } from '../../../login/login.interface';
import { LoginService } from '../../../login/loginservice';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { SharedService } from '../../../shared/shared.service';
import { CartService } from '../../cart/cart.service';
import { UserCart } from '../../cart/userCart.model';
import { MessageService } from 'primeng/api';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  productId: number;
  user: User;
  isLoggedIn: boolean = false;
  userCart: UserCart;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private sanitizer: DomSanitizer,
    private cartService: CartService,
    private sharedService: SharedService,
    private userService: LoginService,
    private messageService: MessageService) {

    this.product = new Product();
    this.user = new User();
    this.userCart = new UserCart();

    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetail();
    });
  }

  ngDoCheck() {
    $('.flexslider').flexslider({
      animation: "slide",
      controlNav: "thumbnails"
    });
    $('.flexslider ol').addClass('fix-hieght')
  }

  ngOnInit(): void {
    //check if user logged in
    if (this.sharedService.getLocalStorage("userInfo")) {
      debugger
      this.user = this.sharedService.getLocalStorage("userInfo");
      this.getUser(this.user.email);
    };
  }

  getUser(email: string) {
    this.userService.getUserByUserName(email, this.user.roleId).subscribe(
      userResponse => {
        this.user = userResponse.body;
      }
    );
  }

  addToCart(product: Product) {
    if (this.user.id > 0) {
      this.ngxService.start();
      this.userCart.isDeleted = false;
      this.userCart.productId = product.id;
      this.userCart.quantity = product.quantity + 1;
      this.userCart.userId = this.user.id;
      this.cartService.addToCart(this.userCart).subscribe(
        res => {
          debugger
          // this.eventsSubject.next();
          // this.sendDataToParent.emit();
          this.ngxService.stop();
          this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Added to cart successfully!' });
        },
        error => {
          this.ngxService.stop();
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('', "Login or register yourself for this action!", 'info', false);
      this.router.navigateByUrl("/user/login");
    }
  }

  transform(path: any) {
    //Call this method in the image source, it will sanitize it.
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  }

  getProductDetail() {
    this.ngxService.start();
    this.productService.getProductById(this.productId).subscribe(
      res => {
        this.product = res.body[0];
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  clear() {
    this.messageService.clear();
  }

}
