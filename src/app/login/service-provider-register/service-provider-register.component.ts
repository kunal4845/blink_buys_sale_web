import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../loginservice";
import { SweetAlertService } from "../../shared/alert/sweetalert.service";
import { User } from '../login.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { roleType, SiteKey } from 'src/app/shared/globalConstants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { State } from 'src/app/user/location/state.model';
import { City } from 'src/app/user/location/city.model';
import { LocationService } from 'src/app/user/location/location.service';
import { ServiceModel } from 'src/app/admin/services/admin-services.model';
import { CategoryModel } from 'src/app/admin/category/category.model';

@Component({
  selector: 'app-service-provider-register',
  templateUrl: './service-provider-register.component.html',
  styleUrls: ['./service-provider-register.component.scss']
})
export class ServiceProviderRegisterComponent implements OnInit {
  @ViewChild('registerForm') public registerForm: NgForm;

  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/;
  emailPattern = /\S+@\S+\.\S+/;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";

  role: roleType;
  SITE_KEY = SiteKey;
  isGst: boolean = false;
  selectedImageFile: File = null;
  selectedIdFile: File = null;
  previewUrlImage: any = null;
  previewUrlId: any = null;
  spinner: boolean = false;
  isEmailExists: boolean = false;
  user: User;
  categorList: CategoryModel[] = [];
  states: State[];
  cities: City[];
  serviceList: ServiceModel[];

  genderList: Array<Object> = [
    { text: 'Male', value: 'Male' },
    { text: 'Female', value: 'Female' }
  ];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sweetAlertService: SweetAlertService,
    private sharedService: SharedService,
    private ngxService: NgxUiLoaderService,
    private _dataService: LocationService
  ) {
    this.user = new User();
    this.getStates();
  }

  getStates(): void {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body;
      }
    );
  }

  ngOnInit() {
    this.getProductCategory();
    this.getServices();
  }

  getServices(): void {
    this.ngxService.start();
    this.sharedService.getServices('').subscribe(
      (response: any) => {
        this.serviceList = response.body.filter(x => x.isDeleted == false);
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error, 'error', false);
      }
    );
  }

  getProductCategory(): void {
    this.ngxService.start();
    this.sharedService.getCategoryList('').subscribe(
      (response: any) => {
        this.categorList = response.body.filter(x => x.isDeleted == false);
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error, 'error', false);
      }
    );
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

  uploadImage(fileInput: any) {
    this.previewUrlImage = '';
    this.selectedImageFile = <File>fileInput.target.files[0];
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrlImage = reader.result;
      reader.readAsDataURL(file);
    }
  }

  uploadId(fileInput: any) {
    this.previewUrlId = '';
    this.selectedIdFile = <File>fileInput.target.files[0];
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrlId = reader.result;
      reader.readAsDataURL(file);
    }
  }


  checkEmailExists(email: string): void {
    debugger
    if (email != "" && this.registerForm.controls.email.status == "VALID") {
      this.ngxService.start();
      this.loginService.checkEmailExists(email, roleType.ServiceProvider).subscribe(
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
          this.sweetAlertService.sweetAlert('', error, 'error', false);
        }
      );
    }
  }


  register(registerForm: NgForm) {
    debugger
    if (!this.isEmailExists && this.selectedIdFile != null && this.selectedIdFile != undefined && this.selectedImageFile != null && this.selectedImageFile != undefined) {
      this.ngxService.start();
      this.user.roleId = roleType.ServiceProvider;
      this.loginService.registerServiceProvider(this.user, this.selectedIdFile, this.selectedImageFile).subscribe(
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
      this.sweetAlertService.sweetAlert('Warning', "Invalid inputs, please check again!!", 'warn', false);
    }
  }
}
