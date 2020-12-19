import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BookedServiceModel } from 'src/app/admin/services/admin-services.model';
import { BookedProductModel } from '../../admin/products/booked-product/booked-product.model';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { MyOrdersService } from './order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  bookedProductList: BookedProductModel[] = [];
  bookedServiceList: BookedServiceModel[] = [];

  bookedProduct: BookedProductModel;

  constructor(
    private orderService: MyOrdersService,
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
  ) {
    this.bookedProduct = new BookedProductModel();
  }

  ngOnInit(): void {
    this.getMyOrders();
    this.getOrderedServices();
  }

  getMyOrders() {
    this.ngxService.start();
    this.orderService.get('').subscribe(
      res => {
        debugger
        this.ngxService.stop();
        this.bookedProductList = res.body.filter(x => !x.isDeleted);
      }, error => {
        this.ngxService.stop();
      });
  }

  getOrderedServices() {
    this.ngxService.start();
    this.orderService.getOrderedServices('').subscribe(
      res => {
        debugger
        this.ngxService.stop();
        this.bookedServiceList = res.body.filter(x => !x.isDeleted);
      }, error => {
        this.ngxService.stop();
      });
  }


  cancel(bookedProduct: BookedProductModel, i: number) {
    this.sweetAlertService.sweetAlertConfirm('Are you  sure!', 'do you want to cancel this order?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.ngxService.start();
        this.orderService.cancelOrder(bookedProduct.bookedProductId).subscribe(
          res => {
            debugger;
            var foundIndex = this.bookedProductList.findIndex(x => x.bookedProductId == bookedProduct.bookedProductId);
            this.bookedProductList[foundIndex].isCancelledByUser = true;
            this.ngxService.stop();
            this.sweetAlertService.sweetAlert('Cancelled Order', "Order cancelled successfully!", 'info', false);
          }, error => {
            this.ngxService.stop();
          });
      }
    });
  }

  cancelService(bookedService: BookedServiceModel, i: number) {
    this.sweetAlertService.sweetAlertConfirm('Are you  sure!', 'do you want to cancel this order?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.ngxService.start();
        this.orderService.cancelService(bookedService.bookedServiceId).subscribe(
          res => {
            debugger;
            var foundIndex = this.bookedServiceList.findIndex(x => x.bookedServiceId == bookedService.bookedServiceId);
            this.bookedServiceList[foundIndex].isCancelledByUser = true;
            this.ngxService.stop();
            this.sweetAlertService.sweetAlert('Cancelled Order', "Order cancelled successfully!", 'info', false);
          }, error => {
            this.ngxService.stop();
          });
      }
    });
  }
}
