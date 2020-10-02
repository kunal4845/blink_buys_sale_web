import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Product } from 'src/app/admin/products/product.model';
import { ProductService } from 'src/app/admin/products/product.service';
import { ProductCategory } from 'src/app/admin/products/productCategory.model';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {
  productList: Product[] = [];
  categoryList: ProductCategory[] = [];

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private sanitizer: DomSanitizer) {
    this.getProductCategory();
  }

  ngAfterContentInit() {
    //set timeout for owlCarousel to load.
    setTimeout(function () {
      $("#owl-demo1").owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [640, 5],
        itemsDesktopSmall: [414, 4],
        navigation: true,
        loop: true,
        rewind: false
      });

      $("#owl-demo2").owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [640, 5],
        itemsDesktopSmall: [414, 4],
        navigation: true,
        loop: true,
        rewind: false
      });
      $('#myModal88').modal('show');
    }, 2000);
  }

  ngOnInit(): void {
    this.getProductList();
  }

  transform(path: any) {
    //Call this method in the image source, it will sanitize it.
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  }

  getProductCategory(): void {
    this.productService.getProductCategory().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.categoryList = response.body;
        }
      }
    );
  }

  getProductList() {
    this.ngxService.start();
    this.productService.getProductList().subscribe(
      res => {
        debugger;
        this.productList = res.body.filter(x => x.isDeleted == false);
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  addToCart(product: Product) {


  }
}
