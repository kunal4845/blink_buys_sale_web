import { AfterContentInit, Component, AfterViewInit, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceModel } from '../../admin/services/admin-services.model';
import { CategoryModel } from '../../admin/category/category.model';
import { Product } from '../../admin/products/product.model';
import { ProductService } from '../../admin/products/product.service';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { CartService } from '../cart/cart.service';
import { UserCart } from '../cart/userCart.model';
import { UserService } from '../services/user-service.service';
import { SharedService } from '../../shared/shared.service';
import { MessageService } from 'primeng/api';
import { CartType } from '../../shared/globalConstants';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterContentInit, OnInit {
  productList: Product[] = [];
  categoryList: CategoryModel[] = [];
  userCart: UserCart;
  serviceList: ServiceModel[] = [];

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService,
    private userService: UserService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private router: Router,
  ) {

    this.userCart = new UserCart();
  }

  ngOnInit() {
    this.getProductList();
    this.getServices();
  }

  ngAfterContentInit() {
    debugger
    // setTimeout(function () {
    //   $("#owl-demo1").owlCarousel({
    //     autoPlay: 3000, //Set AutoPlay to 3 seconds
    //     items: 4,
    //     itemsDesktop: [640, 5],
    //     itemsDesktopSmall: [414, 4],
    //     navigation: true,
    //     loop: true,
    //     rewind: true
    //   });

    //   $("#owl-demo2").owlCarousel({
    //     autoPlay: 3000, //Set AutoPlay to 3 seconds
    //     items: 4,
    //     itemsDesktop: [640, 5],
    //     itemsDesktopSmall: [414, 4],
    //     navigation: true,
    //     loop: true,
    //     rewind: true
    //   });
    //   // $('#myModal88').modal('show');
    // }, 3000);
  }

  // transform(path: any) {
  //   //Call this method in the image source, it will sanitize it.
  //   return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).          changingThisBreaksApplicationSecurity;
  // }

  routeProducts() {
    this.router.navigateByUrl("/user/products");
  }

  routeServices() {
    this.router.navigateByUrl("/user/services");
  }

  getProductList() {
    this.ngxService.start();
    this.productService.getDashoboardProductList().subscribe(
      res => {
        debugger
        this.productList = res.body.filter(x => !x.isDeleted && x.isActive && x.isVerified);

        setTimeout(() => {
          $("#owl-demo2").owlCarousel({
            autoPlay: 3000, //Set AutoPlay to 3 seconds
            items: 4,
            itemsDesktop: [640, 5],
            itemsDesktopSmall: [414, 4],
            navigation: true,
            loop: true,
            rewind: true
          });

        }, 1000);

        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  getServices() {
    this.ngxService.start();
    this.userService.get('').subscribe(res => {
      debugger;
      this.serviceList = res.body.filter(x => !x.isDeleted && x.isActive);
      setTimeout(() => {
        $("#owl-demo1").owlCarousel({
          autoPlay: 3000, //Set AutoPlay to 3 seconds
          items: 4,
          itemsDesktop: [640, 5],
          itemsDesktopSmall: [414, 4],
          navigation: true,
          loop: true,
          rewind: true
        });

      }, 1000);
      this.ngxService.stop();

    }, error => {
      this.ngxService.stop();

    })
  }

  addToCart(product: any, type: string) {
    debugger
    if (this.sharedService.getLocalStorage("customerInfo") != null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {

      this.userCart.isDeleted = false;
      this.userCart.bookedItemId = product.id;

      if (type == CartType.Product) {
        this.userCart.type = CartType.Product;
        this.userCart.quantity = product.quantity + 1;
      } else {
        this.userCart.quantity = 1;
        this.userCart.type = CartType.Service;
      }

      this.ngxService.start();
      this.cartService.addToCart(this.userCart).subscribe(
        res => {
          this.ngxService.stop();
          this.sharedService.setCartValue(1);
          if (type == CartType.Service) {
            this.router.navigateByUrl("/user/checkout");
          }
          this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Added to cart successfully!' });
        },
        error => {
          this.ngxService.stop();
        }
      );

    } else {
      this.sweetAlertService.sweetAlert('', "Login required for performing this action!", 'info', false);
    }
  }
}
