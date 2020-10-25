import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { AdminService } from '../admin.service';
import { CategoryModel } from '../category/category.model';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  user: User;
  categoryList: CategoryModel[] = [];
  previewUrl_image: any = null;
  previewUrl_idProof: any = null;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
    private productService: ProductService,
    private adminService: AdminService,
    public _DomSanitizationService: DomSanitizer
  ) {
    this.user = new User();
    this.getProductCategory();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getProductCategory(): void {
    this.ngxService.start();
    this.productService.getProductCategory('').subscribe(
      (response: any) => {
        this.categoryList = response.body;
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error, 'error', false);
      }
    );
  }

  getUser(): void {
    this.ngxService.start();
    this.adminService.getUser().subscribe(
      userResponse => {
        debugger
        this.user = userResponse.body;
        this.previewUrl_image = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.user.image) as any).changingThisBreaksApplicationSecurity;
        this.previewUrl_idProof = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.user.idProofPath) as any).changingThisBreaksApplicationSecurity;
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }

  onSubmit(): void {
    this.ngxService.start();
    let userObj = new User();
    userObj.password = this.password;
    userObj.confirmPassword = this.confirmPassword;
    userObj.newPassword = this.newPassword;

    this.adminService.updatePassword(userObj).subscribe(
      userResponse => {
        if (userResponse.body) {
          this.password = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.sweetAlertService.sweetAlert('Success', "Password updated successfully!", 'success', false);
        } else {
          this.sweetAlertService.sweetAlert('Error', "Something went wrong!", 'error', false);
        }
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }
}
