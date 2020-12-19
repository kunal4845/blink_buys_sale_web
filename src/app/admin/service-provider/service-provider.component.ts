import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../login/login.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { roleType } from '../../shared/globalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from './service-provider.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ServiceModel } from '../services/admin-services.model';
import { LocationService } from 'src/app/user/location/location.service';
import { State } from 'src/app/user/location/state.model';
import { City } from 'src/app/user/location/city.model';
import { CategoryService } from '../category/category.service';
import { SubCategoryModel } from '../category/sub-category/sub-category.model';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.scss']
})
export class ServiceProviderComponent implements OnInit {
  serviceProviders: User[] = [];
  serviceProvider = new User()
  categoryList: SubCategoryModel[] = [];
  previewUrl_idProofPath: any = null;
  serviceProviderId: number;
  serviceList: ServiceModel[];
  states: State[];
  cities: City[];
  subCategoryIdList : SubCategoryModel[] = [];

  constructor(
    private ngxService: NgxUiLoaderService,
    private providerService: ServiceProviderService,
    public _DomSanitizationService: DomSanitizer,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private _dataService: LocationService,
    private categoryService: CategoryService
  ) {
    this.getSubCategoryList();
    this.getServices();
    this.getCities();
    this.getStates();
    this.route.params.subscribe(params => {
      this.serviceProviderId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getServiceProviders();
  }

  getSubCategoryList(): void {
    this.categoryService.getSubCategoryList('').subscribe(
      response => {
        this.categoryList = response.body.filter(x => !x.isDeleted);
      }
    );
  }

  getServices(): void {
    this.sharedService.getServices('').subscribe(
      response => {
        this.serviceList = response.body.filter(x => x.isDeleted == false);
      }
    );
  }

  getStates() {
    this._dataService.getStates().subscribe(
      userResponse => {
        this.states = userResponse.body;
      }
    );
  }


  getCities() {
    this._dataService.getCities().subscribe(
      userResponse => {
        this.cities = userResponse.body;
      }
    );
  }

  getServiceProviders() {
    this.ngxService.start();
    this.providerService.getServiceProviders().subscribe(list => {
      this.ngxService.stop();
      this.serviceProviders = list.body
        .filter(i => i.roleId === roleType.ServiceProvider && !i.isDeleted && i.id === +this.serviceProviderId);
      
      this.subCategoryIdList = JSON.parse(this.serviceProviders[0].serviceSubCategoryId);

      if (this.serviceProviders.length > 0) {
        this.serviceProvider = this.serviceProviders[0];

        // this.previewUrl_idProofPath = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.serviceProvider.idProofPath) as any).changingThisBreaksApplicationSecurity;
      };
    }, error => {
      this.ngxService.stop();
    });
  }
}
