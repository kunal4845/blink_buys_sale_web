import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../../login/login.interface';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { CategoryModel } from '../../category/category.model';
import { AdminService } from '../../admin.service';
import { BookedServiceModel, ServiceModel } from '../admin-services.model';
import { ServiceProviderService } from '../../service-provider/service-provider.service';
import { LocationService } from '../../../user/location/location.service';
import { City } from '../../../user/location/city.model';
import { State } from '../../../user/location/state.model';
import { roleType } from '../../../shared/globalConstants';
import { CartService } from 'src/app/user/cart/cart.service';
import { BillingAddress } from 'src/app/user/checkout/billingAddress.model';
import { PaymentService } from 'src/app/user/cart/payment/payment.service';
import { PaymentModel } from 'src/app/user/cart/payment/payment.model';

@Component({
  selector: 'app-booked-services',
  templateUrl: './booked-services.component.html',
  styleUrls: ['./booked-services.component.scss']
})
export class BookedServicesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();
  isEdit: boolean = false;
  display = 'none';
  display_assigne_service_provider = 'none';
  display_status_model = 'none';

  bookedServices: BookedServiceModel[] = [];
  categoryList: CategoryModel[] = [];
  serviceList: ServiceModel[];
  userList: User[];
  serviceProviderList: User[];
  cities: City[];
  states: State[];
  selectedUserId: number = 0;
  selectedCity: City;
  selectedState: State;
  bookedService = new BookedServiceModel();
  billingAddress: BillingAddress;
  payment: PaymentModel;
  selectedPaymentStatus: string = '';
  selectedDeliveryStatus: string = '';

  constructor(
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private adminService: AdminService,
    private _dataService: LocationService,
    private providerService: ServiceProviderService,
    private cartService: CartService,
    private paymentService: PaymentService
  ) {
    this.dtTrigger = new Subject();
    this.selectedCity = new City(0, 0, '');
    this.selectedState = new State(0, 0, '');
    this.billingAddress = new BillingAddress();
    this.payment = new PaymentModel();

    this.getServices();
    this.getUsers();
    this.getCities();
    this.getStates();
    this.getBillingAddress();
  }

  ngOnInit(): void {
    this.initDataTable();
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
      this.ngxService.stop();
      this.bookedServices = list.body.filter(i => i.isDeleted == false);

    }, error => {
      this.ngxService.stop();
    });
  }

  getServices() {
    this.adminService.get('').subscribe(res => {
      this.serviceList = res.body.filter(x => x.isDeleted == false);
    });
  }

  getPaymentDetail(paymentId: number) {
    this.ngxService.start();
    this.paymentService.getPaymentDetail(paymentId).subscribe(res => {
      this.payment = res.body;
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
    });
  }


  getUsers() {
    this.ngxService.start();
    this.providerService.getServiceProviders().subscribe(list => {
      this.serviceProviderList = list.body.filter(i => i.isDeleted == false && i.roleId === roleType.ServiceProvider);
      this.userList = list.body.filter(i => i.isDeleted == false);
      this.getBookedServices();
    }, error => {
      this.ngxService.stop();
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
    // this.selectedCity = this.cities.filter(x => x.id == service.cityId)[0];
    // if (this.selectedCity) {
    //   this.selectedState = this.states.filter(x => x.id == this.selectedCity.stateId)[0];
    // }
    this.bookedService.bookedServiceId = service.bookedServiceId;
    this.bookedService.serviceId = service.serviceId;
    this.selectedUserId = service.serviceProviderId;
    this.bookedService.isApprovedByAdmin = true;
    this.display_assigne_service_provider = 'block';
  }

  openStatusUpdateModel(service: BookedServiceModel) {
    debugger;
    this.bookedService = service;
    this.ngxService.start();
    this.paymentService.getPaymentDetail(service.paymentId).subscribe(res => {
      this.payment = res.body;
      this.selectedDeliveryStatus = service.deliveryStatus;
      this.selectedPaymentStatus = this.payment.paymentStatus;
      this.display_status_model = 'block';
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
    });
  }

  updateStatus() {
    debugger
    this.ngxService.start();

    this.bookedService.deliveryStatus = this.selectedDeliveryStatus;
    this.payment.paymentStatus = this.selectedPaymentStatus;

    this.isEdit = true;

    this.adminService.updateStatus(this.bookedService, this.selectedPaymentStatus, this.payment.id).subscribe(res => {
      this.sweetAlertService.sweetAlert('Success', 'Updated successfully!', 'success', false);
      this.getBookedServices();
      // this.payment = res.body;
      // this.selectedDeliveryStatus = service.deliveryStatus;
      // this.selectedPaymentStatus = this.payment.paymentStatus;
      this.display_status_model = 'none';
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
    });
  }

  closeStatus() {
    this.display_status_model = 'none';
  }

  viewDetails(service: BookedServiceModel) {
    this.getPaymentDetail(service.paymentId);
    this.bookedService = service;
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

  close() {
    this.display_assigne_service_provider = 'none';
  }

  getBillingAddress() {
    this.billingAddress.createdDt = new Date();
    this.cartService.getBillingAddress().subscribe(
      res => {
        this.billingAddress = res.body;
      }, error => {
      }
    );
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