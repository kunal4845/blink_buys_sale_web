import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Product } from '../../../admin/products/product.model';
import { ProductService } from '../../../admin/products/product.service';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { SharedService } from '../../../shared/shared.service';
import { CartService } from '../../cart/cart.service';
import { UserCart } from '../../cart/userCart.model';
import { MessageService } from 'primeng/api';
import { CartType } from 'src/app/shared/globalConstants';
declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  productId: number;
  isLoggedIn: boolean = false;
  userCart: UserCart;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService,
    private sharedService: SharedService,
    private messageService: MessageService
  ) {
    this.product = new Product();
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
    // //check if user logged in
    // if (this.sharedService.getLocalStorage("userInfo")) {
    //   this.user = this.sharedService.getLocalStorage("userInfo");
    //   this.getUser(this.user.email);
    // };
  }


  addToCart(product: Product) {debugger
    if (this.sharedService.getLocalStorage("customerInfo") != null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {
      
      this.userCart.isDeleted = false;
      this.userCart.bookedItemId = product.id;
      this.userCart.quantity = product.quantity + 1;
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
      this.sweetAlertService.sweetAlert('', "Login or register yourself for this action!", 'info', false);
    }
  }

  // transform(path: any) {
  //   //Call this method in the image source, it will sanitize it.
  //   return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  // }

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
