import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../../login/login.interface';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { CategoryModel } from '../../category/category.model';
import { AdminService } from '../../admin.service';
import { BookedServiceModel, ServiceModel } from '../admin-services.model';
import { SharedService } from '../../../shared/shared.service';
import { ServiceProviderService } from '../../service-provider/service-provider.service';
import { LocationService } from 'src/app/user/location/location.service';
import { City } from 'src/app/user/location/city.model';
import { State } from 'src/app/user/location/state.model';
import { roleType } from 'src/app/shared/globalConstants';
import { LoginService } from 'src/app/login/loginservice';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.scss']
})
export class MyServicesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();
  isEdit: boolean = false;
  display = 'none';

  bookedServices: BookedServiceModel[] = [];
  categoryList: CategoryModel[] = [];
  serviceList: ServiceModel[];
  userList: User[];
  serviceProviderList: User[];
  cities: City[];
  states: State[];
  selectedCity: City;
  selectedState: State;
  userId: number;
  user = new User();
  serviceProviderId: number;

  constructor(
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private adminService: AdminService,
    private _dataService: LocationService,
    private sharedService: SharedService,
    private providerService: ServiceProviderService,
    private loginService: LoginService,
    private route: ActivatedRoute,
  ) {
    this.dtTrigger = new Subject();
    this.selectedCity = new City(0, 0, '');
    this.selectedState = new State(0, 0, '');

    this.getServices();
    this.getUsers();
    this.getCities();
    this.getStates();

    this.route.params.subscribe(params => {
      this.serviceProviderId = params['id'];
      this.getBookedServices();
    });
  }

  ngOnInit(): void {
    this.initDataTable();
  }

  getBookedServices() {
    this.ngxService.start();
    this.adminService.getBookedServices('').subscribe(list => {
      
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this.ngxService.stop();
      this.bookedServices = list.body.filter(i => !i.isDeleted && i.serviceProviderId == +this.serviceProviderId);

    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

  getServices() {
    this.adminService.get('').subscribe(res => {
      this.serviceList = res.body.filter(x => !x.isDeleted);
    });
  }

  getUsers() {
    this.providerService.getServiceProviders().subscribe(list => {
      this.serviceProviderList = list.body.filter(i => !i.isDeleted && i.roleId === roleType.ServiceProvider);
      this.userList = list.body.filter(i => !i.isDeleted);
    });
  }

  getCities() {
    this._dataService.getCities().subscribe(
      userResponse => {
        this.cities = userResponse.body;
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

  reject(service: BookedServiceModel) {
    this.sweetAlertService.sweetAlertConfirm('Reject Confirm!', 'Are you sure you want to reject?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.adminService.rejectedByServiceProvider(service.bookedServiceId).subscribe(res => {
          this.sweetAlertService.sweetAlert('Success', 'Service rejected successfully!', 'success', false);
          this.getBookedServices();
          this.display = 'none';
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', 'Something went wrong!', 'error', false);
        });
      }
    });
  }

  approve(service: BookedServiceModel) {
    this.sweetAlertService.sweetAlertConfirm('Approve Confirm!', 'Are you sure you want to approve?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.adminService.approvedByServiceProvider(service.bookedServiceId).subscribe(res => {
          this.sweetAlertService.sweetAlert('Success', 'Service accepted successfully!', 'success', false);
          this.getBookedServices();
          this.display = 'none';
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', 'Something went wrong!', 'error', false);
        });
      }
    });
  }

  customerDetails(service: BookedServiceModel) {
    this.display = 'block';
    this.ngxService.start();
    this.sharedService.getUserById(service.userId).subscribe(res => {
      this.ngxService.stop();
      this.user = res.body;

    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', 'Something went wrong!', 'error', false);
    });
  }

  onCloseHandled() {
    this.display = 'none';
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
        { orderable: false, targets: 6 }
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