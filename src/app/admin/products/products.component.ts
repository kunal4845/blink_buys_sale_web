import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CategoryModel } from '../category/category.model';
import { Product } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<Product> = new Subject();
  isEdit: boolean = false;


  productList: Product[] = [];
  categoryList: CategoryModel[] = [];

  constructor(private productService: ProductService,
    private _DomSanitizationService: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService) {
    this.dtTrigger = new Subject();
    this.getProductCategory();

  }

  ngOnInit(): void {
    this.initDataTable();

    this.getProductList();
  }

  getProductCategory(): void {
    this.ngxService.start();

    this.productService.getProductCategory('').subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.categoryList = response.body;
        } this.ngxService.stop();

      },
      (error) => {
        this.ngxService.stop();

        this.sweetAlertService.sweetAlert('Error', error, 'error', false);
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
        this.sweetAlertService.sweetAlert('Error', error.message, 'error', false);
      }
    );
    if (!this.isEdit) {
      this.dtTrigger.next();
    } else {
      this.reRender();
    }
  }

  verifyProduct(product: Product) {
    this.ngxService.start();
    this.productService.verifyProduct(product.id).subscribe(res => {
      if (res.body) {
        this.sweetAlertService.sweetAlert('Success', "Verified Successfully!", 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Error', "Some error occured, not verified!", 'error', false);
      }
      this.getProductList();
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

  deleteProduct(product: Product) {
    this.ngxService.start();
    this.productService.deleteProduct(product.id).subscribe(res => {
      if (res.body) {
        this.sweetAlertService.sweetAlert('Success', "Deleted Successfully!", 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Error', "Some error occured, not deleted!", 'error', false);
      }
      this.getProductList();
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }


  private initDataTable(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 15,
      paging: true,
      searching: true,
      responsive: true,
      lengthMenu: [5, 10, 15, 20, 25],
      columnDefs: [
        { orderable: false, targets: 3 }
      ]
    };
  }

  private reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
