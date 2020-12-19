import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { User } from 'src/app/login/login.interface';
import { roleType } from 'src/app/shared/globalConstants';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { AdminService } from '../admin.service';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
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
  display = 'none';
  updatedPrice: any;
  price: any;
  commissionPercentage: number;
  product: Product;
  user: User;

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private categoryService: CategoryService,
    private adminService: AdminService
  ) {
    this.dtTrigger = new Subject();
    this.product = new Product();
    this.user = new User();
    this.getProductCategory();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getUser();
  }

  openModal() {
    this.display = 'block';
  }

  clear() {
    this.updatedPrice = '';
    this.price = '';
    this.commissionPercentage = 0;
  }

  onCloseHandled(form: NgForm) {
    this.clear();
    this.display = 'none';
  }

  onChangePercentage() {
    this.updatedPrice = this.price + ((this.price * this.commissionPercentage) / 100);
    this.product.commissionPercentage = this.commissionPercentage;
  }

  edit(product: Product) {
    this.updatedPrice = product.price + ((product.price * product.commissionPercentage) / 100);
    this.price = product.price;
    this.commissionPercentage = product.commissionPercentage;
    this.product = product;
    this.openModal();
  }

  getProductCategory(): void {
    this.categoryService.getProductCategory('').subscribe(
      response => {
        this.categoryList = response.body.filter(x => !x.isDeleted);
      }
    );
  }

  getUser(): void {
    this.ngxService.start();
    this.adminService.getUser().subscribe(
      userResponse => {
        this.user = userResponse.body;
        this.getProductList();
      }, error => {
        this.ngxService.stop();
      }
    );
  }


  getProductList() {
    this.productService.getProductList().subscribe(
      res => {
        if (!this.isEdit) {
          this.dtTrigger.next();
        } else {
          this.reRender();
        }
        if (this.user.roleId === roleType.Dealer) {
          this.productList = res.body.filter(x => !x.isDeleted && x.createdBy === this.user.id);
        } else if (this.user.roleId === roleType.Admin) {
          this.productList = res.body.filter(x => !x.isDeleted);
        }
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  verifyProduct(product: Product) {
    this.sweetAlertService.sweetAlertConfirm('Verify Confirm!', 'Are you sure you want to verify this product?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.productService.verifyProduct(product.id).subscribe(res => {
          this.isEdit = true;
          this.sweetAlertService.sweetAlert('Success', "Verified Successfully!", 'success', false);
          this.getProductList();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
    });
  }

  blockProduct(product: Product) {

    this.sweetAlertService.sweetAlertConfirm('Block Confirm!', 'Are you sure you want to block this product?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.productService.blockProduct(product.id).subscribe(res => {
          this.isEdit = true;
          this.sweetAlertService.sweetAlert('Success', "De-activated Successfully!", 'success', false);
          this.getProductList();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
    });
  }

  deleteProduct(product: Product) {
    this.sweetAlertService.sweetAlertConfirm('Delete Confirm!', 'Are you sure you want to delete?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.productService.deleteProduct(product.id).subscribe(res => {
          this.isEdit = true;
          this.sweetAlertService.sweetAlert('Success', "Deleted Successfully!", 'success', false);
          this.getProductList();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
    });
  }

  activeProduct(product: Product) {

    this.sweetAlertService.sweetAlertConfirm('Re-activate Confirm!', 'Are you sure you want to re-activate?', 'warning', true).then(confirm => {
      if (confirm.value === true) {

        this.isEdit = true;
        this.ngxService.start();
        this.product = product;
        this.product.isActive = true;
        this.productService.post(this.product).subscribe(res => {
          this.sweetAlertService.sweetAlert('Success', "Activated Successfully!", 'success', false);
          this.getProductList();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
    });
  }


  updateProductPrice() {
    this.isEdit = true;
    this.ngxService.start();
    this.productService.post(this.product).subscribe(res => {
      this.sweetAlertService.sweetAlert('Success', "Updated Successfully!", 'success', false);
      this.getProductList();
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
        { orderable: false, targets: 7 }
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
