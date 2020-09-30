import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LoginService } from '../../login/loginservice';
import { ProductService } from '../products/product.service';
import { ProductCategory } from '../products/productCategory.model';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  user: User;
  categoryList: ProductCategory[] = [];
  ID: any;
  cheque: any;

  constructor(private router: Router, private sharedService: SharedService,
    private sweetAlertService: SweetAlertService, private ngxService: NgxUiLoaderService, private productService: ProductService, public _DomSanitizationService: DomSanitizer) {
    this.user = new User();
    this.getProductCategory();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getProductCategory(): void {
    this.ngxService.start();
    this.productService.getProductCategory().subscribe(
      (response: any) => {
        debugger
        if (response.status === 200) {
          this.categoryList = response.body;
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error, 'error', false);
      }
    );
  }
  getUser(): void {
    debugger
    this.ngxService.start();

    this.sharedService.getUser().subscribe(
      userResponse => {
        debugger
        this.user = userResponse.body;
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error.statusText, 'error', false);
      }
    );
  }


  openCheque(oldURL: string): string {
    return this._DomSanitizationService.sanitize(SecurityContext.URL, oldURL);
  }

  openId(oldURL: string): string {
    return this._DomSanitizationService.sanitize(SecurityContext.URL, oldURL);
  }
}
