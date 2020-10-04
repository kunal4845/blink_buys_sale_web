import { AfterContentInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { Product } from 'src/app/admin/products/product.model';
import { ProductService } from 'src/app/admin/products/product.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CartService } from '../../cart/cart.service';
declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  productId: number;
  eventsSubject: Subject<void> = new Subject<void>();

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private sanitizer: DomSanitizer, private cartService: CartService) {
    this.product = new Product();

    this.route.params.subscribe(params => {
      debugger;
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
  }

  addToCart(product: Product) {
    debugger
    product.quantity = 1;
    this.cartService.addToCart(product);
    this.eventsSubject.next();
    $('#cartModal').modal('show');
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

}
