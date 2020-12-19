import { AfterContentInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/admin/products/product.model';
import { ProductService } from 'src/app/admin/products/product.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CartType } from 'src/app/shared/globalConstants';
import { SharedService } from 'src/app/shared/shared.service';
import { CartService } from '../../cart/cart.service';
import { UserCart } from '../../cart/userCart.model';
import { UserService } from '../../services/user-service.service';
declare var $: any;

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, AfterContentInit {
  productList: Product[] = [];
  userCart: UserCart;

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.userCart = new UserCart();
  }

  ngAfterContentInit() {
    //set timeout for owlCarousel to load.
    setTimeout(function () {
      $("#owl-demo5").owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [640, 5],
        itemsDesktopSmall: [414, 4],
        navigation: true,
        loop: true,
        rewind: true
      });
    }, 2000);
  }


  ngOnInit(): void {
    this.getRecommendedProducts();
  }

  // transform(path: any) {
  //   //Call this method in the image source, it will sanitize it.
  //   return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  // }

  getRecommendedProducts() {
    this.productService.getRecommendedProducts().subscribe(
      res => {
        this.productList = res.body;
      }
    );
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
  
}
