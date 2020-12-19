import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../login/login.interface';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { AdminService } from '../admin.service';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: ElementRef;
  user: User;
  categoryList: CategoryModel[] = [];
  previewUrl_image: any = null;
  previewUrl_idProof: any = null;
  previewUrl_CancelledCheque: any = null;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
    private adminService: AdminService,
    public _DomSanitizationService: DomSanitizer,
    private categoryService: CategoryService
  ) {
    this.user = new User();
    this.getProductCategory();
  }

  ngOnInit(): void {
    this.getUser();
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
        // this.previewUrl_image = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.user.image) as any).changingThisBreaksApplicationSecurity;

        // this.previewUrl_idProof = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.user.idProofPath) as any).changingThisBreaksApplicationSecurity;

        // this.previewUrl_CancelledCheque = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.user.cancelledChequePath) as any).changingThisBreaksApplicationSecurity;

        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Failed', error, 'error', false);
      }
    );
  }

  changeProfile(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl_image = reader.result;
      reader.readAsDataURL(file);
    }
    this.ngxService.start();
    this.adminService.updateProfileImage(<File>fileInput.target.files[0]).subscribe(
      userResponse => {
        this.myInputVariable.nativeElement.value = "";
        this.sweetAlertService.sweetAlert('Success', "Updated successfully!", 'success', false);
        this.getUser();
      },
      error => {
        this.ngxService.stop();
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
