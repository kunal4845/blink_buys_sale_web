import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryModel } from 'src/app/admin/category/category.model';
import { Product } from 'src/app/admin/products/product.model';
import { ProductService } from 'src/app/admin/products/product.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  isOpen: boolean = false;
  productList: Product[] = [];
  categoryList: CategoryModel[] = [];

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private sanitizer: DomSanitizer) { this.getProductCategory(); }

  ngOnInit(): void {
    this.getProductList();
  }

  transform(path: any) {
    //Call this method in the image source, it will sanitize it.
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  }

  getProductCategory(): void {
    this.productService.getProductCategory('').subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.categoryList = response.body;
        }
      }
    );
  }


  clickEvent() {
    this.isOpen = !this.isOpen;
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
}
