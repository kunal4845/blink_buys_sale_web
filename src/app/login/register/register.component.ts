import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../loginservice";
import { SweetAlertService } from "../../shared/alert/sweetalert.service";
import { User } from '../login.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { roleType, SiteKey } from 'src/app/shared/globalConstants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryModel } from 'src/app/admin/category/category.model';
import { LocationService } from '../../user/location/location.service';
import { State } from 'src/app/user/location/state.model';
import { City } from 'src/app/user/location/city.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerForm') public registerForm: NgForm;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  emailPattern = /\S+@\S+\.\S+/;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";

  spinner: boolean = false;
  isEmailExists: boolean = false;
  user: User;
  role: roleType;
  SITE_KEY = SiteKey;
  categoryList: CategoryModel[] = [];
  isGst: boolean = false;
  selectedChequeFile: File = null;
  selectedIdFile: File = null;
  previewUrl1: any = null;
  previewUrl2: any = null;
  states: State[];
  cities: City[];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private _dataService: LocationService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.getProductCategory();
    this.getStates();
  }

  getStates(): void {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body;
      }
    );
  }

  getProductCategory(): void {
    this.ngxService.start();
    this.sharedService.getCategoryList('').subscribe(
      (response: any) => {
        debugger
        if (response.status === 200) {
          this.categoryList = response.body.filter(x => x.isDeleted == false);
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
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl1 = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadId(fileInput: any) {
    this.selectedIdFile = <File>fileInput.target.files[0];
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl2 = reader.result;
      reader.readAsDataURL(file);
    }
  }

  checkEmailExists(email: string): void {
    if (email != "" && this.registerForm.controls.email.status == "VALID") {
      this.ngxService.start();
      this.loginService.checkEmailExists(email, roleType.Dealer).subscribe(
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

  onSelect(countryId: number): void {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body.filter((item) => item.countryId == countryId);
      }
    );
  }

  select(stateId: number): void {
    this._dataService.getCities().subscribe(
      userResponse => {
        this.cities = userResponse.body.filter((item) => item.stateId == stateId);
      }
    );
  }

  register(registerForm: NgForm) {
    if (!this.isEmailExists && this.selectedIdFile != null && this.selectedIdFile != undefined && this.selectedChequeFile != null && this.selectedChequeFile != undefined) {

      if (this.user.isGstAvailable == "Yes") {
        if (this.user.gstNumber == "") {
          this.sweetAlertService.sweetAlert('Warning', "Please enter the GST number", 'warning', false);
          return false;
        }
      }

      if (this.user.email != "" && this.user.password != "" && this.user.confirmPassword != "" && this.user.name != "" &&
        this.user.password == this.user.confirmPassword) {
        this.ngxService.start();
        this.user.roleId = roleType.Dealer;

        this.loginService.register(this.user, this.selectedIdFile, this.selectedChequeFile).subscribe(
          (userResponse: any) => {
            if (userResponse.status === 200) {
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
