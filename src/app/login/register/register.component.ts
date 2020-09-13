import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../loginservice";
import { SweetAlertService } from "../../shared/alert/sweetalert.service";
import { User } from '../login.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { roleType, SiteKey } from 'src/app/shared/globalConstants';
import { ProductService } from 'src/app/admin/products/product.service';
import { ProductCategory } from 'src/app/admin/products/productCategory.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  spinner: boolean = false;
  isEmailExists: boolean = false;
  user: User;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  emailPattern = /\S+@\S+\.\S+/;
  role: roleType;
  SITE_KEY = SiteKey;
  categorList: ProductCategory[] = [];
  isGst: boolean = false;
  selectedChequeFile: File = null;
  selectedIdFile: File = null;
  @ViewChild('registerForm') public registerForm: NgForm;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private productService: ProductService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.getProductCategory();
  }

  getProductCategory(): void {
    this.ngxService.start();

    this.productService.getProductCategory().subscribe(
      (response: any) => {

        if (response.status === 200) {
          this.categorList = response.body;
        }
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error, 'error', false);
      }
    );
  }

  isGstAvailable() {
    this.isGst = true;
  }

  isGstNotAvailable() {
    this.isGst = false;
  }

  uploadCheque(fileInput: any) {
    this.selectedChequeFile = <File>fileInput.target.files[0];

  }

  uploadId(fileInput: any) {
    this.selectedIdFile = <File>fileInput.target.files[0];
  }


  checkEmailExists(email: string): void {

    if (email != "" && this.registerForm.controls.email.status == "VALID") {
      this.ngxService.start();

      this.loginService.checkEmailExists(email).subscribe(
        (response: any) => {

          if (response.status === 200 && response.body != null) {
            this.isEmailExists = true;
          } else {
            this.isEmailExists = false;
          }
          this.ngxService.stop();

        },
        (error) => {
          this.ngxService.stop();

          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        }
      );
    }
  }

  checkGstNumber(user: User) {

  }

  register(registerForm: NgForm) {
    if (!this.isEmailExists) {

      if (this.user.isGstAvailable == "Yes") {
        if (this.user.gstNumber == "") {
          this.sweetAlertService.sweetAlert('Warning', "Please enter the GST number", 'warning', false);
          return false;
        }
      }

      if (this.user.email != "" && this.user.password != "" && this.user.confirmPassword != "" && this.user.name != "" &&
        this.user.password == this.user.confirmPassword) {
        this.ngxService.start();

        this.loginService.register(this.user, this.selectedIdFile, this.selectedChequeFile).subscribe(
          (userResponse: any) => {
            if (userResponse.status === 200) {
              ;

              localStorage.setItem("token", userResponse.body.token);
              this.sharedService.setLocalStorage("userInfo", userResponse.body);

              registerForm.reset();

              this.router.navigateByUrl("/admin/dashboard");
              this.sweetAlertService.sweetAlert('Success', "Registered successfully", 'success', false);
            }
            this.ngxService.stop();
          },
          error => {
            this.sweetAlertService.sweetAlert('Error', error.statusText, 'error', false);
            this.ngxService.stop();
          }
        );
      } else {
        this.ngxService.stop();

        this.sweetAlertService.sweetAlert('Warning', "Enter a different email!!", 'warn', false);
      }
    } else {
      this.ngxService.stop();

      this.sweetAlertService.sweetAlert('Warning', "Fill up the mandatory fields!!", 'warn', false);
    }
  }
}
