import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../../login/login.interface';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryModel } from '../../category/category.model';
import { AdminService } from '../../admin.service';
import { BookedServiceModel, ServiceModel } from '../admin-services.model';
import { SharedService } from '../../../shared/shared.service';
import { ServiceProviderService } from '../../service-provider/service-provider.service';
import { LocationService } from 'src/app/user/location/location.service';
import { City } from 'src/app/user/location/city.model';
import { State } from 'src/app/user/location/state.model';
import { roleType } from 'src/app/shared/globalConstants';

@Component({
  selector: 'app-booked-services',
  templateUrl: './booked-services.component.html',
  styleUrls: ['./booked-services.component.scss']
})
export class BookedServicesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();

  display = 'none';
  bookedServices: BookedServiceModel[] = [];
  isEdit: boolean = false;
  categoryList: CategoryModel[] = [];
  previewUrl: any = null;
  title: string;
  serviceList: ServiceModel[];
  userList: User[];
  selectedUserId: number;
  cities: City[];
  states: State[];

  selectedCity: City;
  selectedState: State;

  bookedService = new BookedServiceModel();

  constructor(
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private adminService: AdminService,
    private _dataService: LocationService,
    private sharedService: SharedService,
    private providerService: ServiceProviderService,
    public _DomSanitizationService: DomSanitizer
  ) {
    this.dtTrigger = new Subject();
    this.selectedCity = new City(0, 0, '');
    this.selectedState = new State(0, 0, '');

    this.getServices();
    this.getUsers();
    this.getCities();
    this.getStates();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getBookedServices();
  }

  getBookedServices() {
    this.ngxService.start();
    this.adminService.getBookedServices('').subscribe(list => {
      debugger
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this.bookedServices = list.body.filter(i => i.isDeleted == false);
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

  getServices() {
    this.adminService.get('').subscribe(res => {
      this.serviceList = res.body.filter(x => x.isDeleted == false);
    });
  }

  getUsers() {
    this.providerService.getServiceProviders().subscribe(list => {
      debugger
      this.userList = list.body.filter(i => i.isDeleted == false && i.roleId === roleType.ServiceProvider);
    });
  }

  getCities() {
    this._dataService.getCities().subscribe(
      userResponse => {
        debugger
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
        this.adminService.rejectService(service.bookedServiceId).subscribe(res => {
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
    debugger
    this.selectedCity = this.cities.filter(x => x.id == service.cityId)[0];
    if (this.selectedCity) {
      this.selectedState = this.states.filter(x => x.id == this.selectedCity.stateId)[0];
    }
    this.bookedService.bookedServiceId = service.bookedServiceId;
    this.bookedService.serviceId = service.serviceId;
    this.bookedService.cityId = service.cityId;
    this.display = 'block';
  }

  create(): void {
    this.ngxService.start();
    this.bookedService.serviceProviderId = this.selectedUserId;
    this.isEdit = true;
    this.adminService.assignServiceProvider(this.bookedService).subscribe(res => {
      this.sweetAlertService.sweetAlert('Success', 'Service provider assigned successfully!', 'success', false);
      this.getBookedServices();
      this.display = 'none';
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