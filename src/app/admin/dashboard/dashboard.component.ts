import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../login/login.interface';
import { roleType } from '../../shared/globalConstants';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { DealerService } from '../dealer/dealer.service';
import { LoginService } from '../../login/loginservice';
import { ServiceProviderService } from '../service-provider/service-provider.service';
import { ServiceProviderAvailability } from '../service-provider/service-provider-availability.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  itemList = [];
  selectedItems = [];
  settings = {};

  count: number;
  dealers: number;
  serviceProviders: number;
  customers: number;
  role: string = '';
  user = new User();

  mytime: Date = new Date();
  isTodayOff: boolean = false;
  serviceProviderAvailability: ServiceProviderAvailability;
  constructor(
    private ngxService: NgxUiLoaderService,
    private dealerService: DealerService,
    private loginService: LoginService,
    private providerService: ServiceProviderService,
    private sweetAlertService: SweetAlertService
  ) {
    this.serviceProviderAvailability = new ServiceProviderAvailability()
  }

  ngOnInit(): void {
    // this.itemList = [
    //   { "id": 1, "itemName": "Sunday" },
    //   { "id": 2, "itemName": "Monday" },
    //   { "id": 3, "itemName": "Tuesday" },
    //   { "id": 4, "itemName": "Wednesday" },
    //   { "id": 5, "itemName": "Thursday" },
    //   { "id": 6, "itemName": "Friday" },
    //   { "id": 7, "itemName": "Saturday" }
    // ];
    // this.selectedItems = [
    // ];

    // this.settings = {
    //   text: "Select Days",
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   classes: "",
    //   singleSelection: false,
    //   badgeShowLimit: 3,
    //   lazyLoading: true
    // };
    this.getUsers();
    this.getLoggedInUser();
  }

  // onItemSelect(item: any) {
  // }

  // OnItemDeSelect(item: any) {
  // }

  // onSelectAll(items: any) {
  //   this.selectedItems = items;
  // }

  // onDeSelectAll(items: any) {
  // }


  getUsers() {
    this.ngxService.start();
    this.dealerService.getDealers().subscribe(list => {
      this.ngxService.stop();
      this.dealers = list.body.filter(i => i.roleId === roleType.Dealer && !i.isDeleted).length;
      this.serviceProviders = list.body.filter(i => i.roleId === roleType.ServiceProvider && !i.isDeleted).length;
      this.customers = list.body.filter(i => i.roleId === roleType.User && !i.isDeleted).length;
    }, error => {
      this.ngxService.stop();
    });

  }

  getLoggedInUser(): void {
    this.loginService.getUser().subscribe(
      userResponse => {
        
        this.user = userResponse.body;
        if (this.user.roleId === roleType.Dealer) {
          this.role = 'Dealer';
        } else if (this.user.roleId === roleType.ServiceProvider) {
          this.role = 'Service Provider';
          this.getServiceProviderAvailability();
        } else if (this.user.roleId === roleType.Admin) {
          this.role = 'Admin';
        }
      },
      error => {
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }

  submitAvailability(): void {
    

    // this.serviceProviderAvailability.days = JSON.stringify(this.selectedItems);
    this.serviceProviderAvailability.isActive = this.isTodayOff;
    this.serviceProviderAvailability.isDeleted = false;
    this.serviceProviderAvailability.serviceProviderId = this.user.id;
    this.ngxService.start();
    this.providerService.submitAvailability(this.serviceProviderAvailability).subscribe(
      userResponse => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Success', 'Updated successfully', 'success', false);
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }

  setTodayOff() {
    this.isTodayOff = !this.isTodayOff;
  }

  getServiceProviderAvailability(): void {
    this.providerService.getServiceProviderAvailability(this.user.id).subscribe(
      userResponse => {
        
        this.serviceProviderAvailability = userResponse.body;
        if (this.serviceProviderAvailability) {
          // this.selectedItems = JSON.parse(this.serviceProviderAvailability.days);
          this.isTodayOff = this.serviceProviderAvailability.isActive;
        } else {
          this.serviceProviderAvailability = new ServiceProviderAvailability();
        }
      },
      error => {
        this.sweetAlertService.sweetAlert('', error.statusText, 'error', false);
      }
    );
  }
}
