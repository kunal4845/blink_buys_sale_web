import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../../login/login.interface';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { CategoryModel } from '../../category/category.model';
import { LocationService } from '../../../user/location/location.service';
import { City } from '../../../user/location/city.model';
import { State } from '../../../user/location/state.model';
import { roleType } from '../../../shared/globalConstants';
import { CartService } from '../../../user/cart/cart.service';
import { BillingAddress } from '../../../user/checkout/billingAddress.model';
import { PaymentService } from '../../../user/cart/payment/payment.service';
import { PaymentModel } from '../../../user/cart/payment/payment.model';
import { BookedProductModel } from './booked-product.model';
import { BookedProductService } from './booked-product.service';
import { DealerService } from '../../dealer/dealer.service';

@Component({
  selector: 'app-booked-product',
  templateUrl: './booked-product.component.html',
  styleUrls: ['./booked-product.component.scss']
})
export class BookedProductComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<BookedProductModel> = new Subject();
  isEdit: boolean = false;
  display = 'none';
  display_assigne_service_provider = 'none';
  display_status_model = 'none';

  bookedProducts: BookedProductModel[] = [];
  categoryList: CategoryModel[] = [];
  userList: User[];
  dealerList: User[];
  cities: City[];
  states: State[];

  bookedProduct = new BookedProductModel();
  billingAddress: BillingAddress;
  payment: PaymentModel;
  selectedPaymentStatus: string = '';
  selectedDeliveryStatus: string = '';

  constructor(
    private _ngxService: NgxUiLoaderService,
    private _sweetAlertService: SweetAlertService,
    private _bookedProduct: BookedProductService,
    private _dataService: LocationService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private dealerService: DealerService
  ) {
    this.dtTrigger = new Subject();
    this.billingAddress = new BillingAddress();
    this.payment = new PaymentModel();

    // this.getServices();
    // this.getUsers();
    // this.getCities();
    // this.getStates();
    this.getBillingAddress();
  }

  ngOnInit(): void {
    this.initDataTable();
  }

  getBookedProducts() {
    this._ngxService.start();
    this._bookedProduct.getBookedProducts('').subscribe(list => {
      debugger
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this._ngxService.stop();
      this.bookedProducts = list.body.filter(i => !i.isDeleted);
    }, error => {
      this._ngxService.stop();
    });
  }


  getPaymentDetail(paymentId: number) {
    this._ngxService.start();
    this.paymentService.getPaymentDetail(paymentId).subscribe(res => {
      this.payment = res.body;
      this._ngxService.stop();
    }, error => {
      this._ngxService.stop();
    });
  }


  getUsers() {
    this._ngxService.start();
    this.dealerService.getDealers().subscribe(list => {
      this.dealerList = list.body.filter(i => i.isDeleted == false && i.roleId === roleType.Dealer);
      this.userList = list.body.filter(i => i.isDeleted == false);
      this.getBookedProducts();
    }, error => {
      this._ngxService.stop();
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

  reject(product: BookedProductModel) {
    this._sweetAlertService.sweetAlertConfirm('Reject Confirm!', 'Are you sure you want to reject?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this._ngxService.start();
        // this._bookedProduct.rejectService(product.bookedProductId).subscribe(res => {
        //   this._sweetAlertService.sweetAlert('Success', 'Service rejected successfully!', 'success', false);
        //   this.getBookedProducts();
        //   this.display = 'none';
        // }, error => {
        //   this._ngxService.stop();
        //   this._sweetAlertService.sweetAlert('Error', 'Something went wrong!', 'error', false);
        // });
      }
    });
  }

  approve(product: BookedProductModel) {
    debugger
    // this.selectedCity = this.cities.filter(x => x.id == service.cityId)[0];
    // if (this.selectedCity) {
    //   this.selectedState = this.states.filter(x => x.id == this.selectedCity.stateId)[0];
    // }
    // this.bookedService.bookedServiceId = service.bookedServiceId;
    // this.bookedService.serviceId = service.serviceId;
    // this.selectedUserId = service.serviceProviderId;
    // this.bookedService.isApprovedByAdmin = true;
    // this.display_assigne_service_provider = 'block';
  }

  openStatusUpdateModel(product: BookedProductModel) {
    debugger;
    this.bookedProduct = product;
    this._ngxService.start();
    this.paymentService.getPaymentDetail(product.paymentId).subscribe(res => {
      this.payment = res.body;
      this.selectedDeliveryStatus = product.deliveryStatus;
      this.selectedPaymentStatus = this.payment.paymentStatus;
      this.display_status_model = 'block';
      this._ngxService.stop();
    }, error => {
      this._ngxService.stop();
    });
  }

  updateStatus() {
    debugger
    this._ngxService.start();

    this.bookedProduct.deliveryStatus = this.selectedDeliveryStatus;
    this.payment.paymentStatus = this.selectedPaymentStatus;

    this.isEdit = true;

    // this._bookedProduct.updateStatus(this.bookedProduct, this.selectedPaymentStatus, this.payment.id).subscribe(res => {
    //   this._sweetAlertService.sweetAlert('Success', 'Updated successfully!', 'success', false);
    //   this.getBookedProducts();
    //   // this.payment = res.body;
    //   // this.selectedDeliveryStatus = service.deliveryStatus;
    //   // this.selectedPaymentStatus = this.payment.paymentStatus;
    //   this.display_status_model = 'none';
    //   this._ngxService.stop();
    // }, error => {
    //   this._ngxService.stop();
    // });
  }

  closeStatus() {
    this.display_status_model = 'none';
  }

  viewDetails(product: BookedProductModel) {
    this.getPaymentDetail(product.paymentId);
    this.bookedProduct = product;
    this.display = 'block';
  }

  create(): void {
    this._ngxService.start();
    // this.bookedProduct = this.selectedUserId;
    this.isEdit = true;
    // this._bookedProduct.assignServiceProvider(this.bookedProduct).subscribe(res => {
    //   this._sweetAlertService.sweetAlert('Success', 'Service provider assigned successfully!', 'success', false);
    //   this.getBookedProducts();
    //   this.display = 'none';
    // }, error => {
    //   this._ngxService.stop();
    //   this._sweetAlertService.sweetAlert('Error', 'Something went wrong!', 'error', false);
    // });
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