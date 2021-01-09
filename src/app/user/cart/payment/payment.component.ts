import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/shared.service';
import { Product } from '../../../admin/products/product.model';
import { LoginService } from '../../../login/loginservice';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { CartType } from '../../../shared/globalConstants';
import { BillingAddress } from '../../checkout/billingAddress.model';
import { CartService } from '../cart.service';
import { UserCart } from '../userCart.model';
import { PaymentModel } from './payment.model';
import { PaymentService } from './payment.service';
import { TransactionModel } from './transaction.model';
declare var $: any;


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  productList: Product[] = [];
  userCarts: UserCart[] = [];
  totalCost: number = 0;
  billingAddress: BillingAddress;
  isCashOnDelivery: boolean = false;
  payment: PaymentModel;
  public payPalConfig?: IPayPalConfig;

  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;

  transactionModel: TransactionModel;
  constructor(
    private loginService: LoginService,
    private cartService: CartService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
    private paymentService: PaymentService,
    private sharedService: SharedService,
  ) {
    this.payment = new PaymentModel();
    this.billingAddress = new BillingAddress();
    this.transactionModel = new TransactionModel();

    this.getCartDetails();
  }


  ngOnInit(): void {
    this.initConfig();

    $('#horizontalTab').easyResponsiveTabs({
      type: 'default', //Types: default, vertical, accordion           
      width: 'auto', //auto or any width like 600px
      fit: true, // 100% fit in a container
      closed: 'accordion', // Start closed if in accordion view
      activate: function (event) { // Callback function if tab is switched
        var $tab = $(this);
        var $info = $('#tabInfo');
        var $name = $('span', $info);
        $name.text($tab.text());
        $info.show();
      }
    });
    $('#verticalTab').easyResponsiveTabs({
      type: 'vertical',
      width: 'auto',
      fit: true
    });


  }

  private initConfig(): void {
    debugger
    this.payPalConfig = {
      currency: 'INR',
      clientId: 'ARFQJFtPLb7bdmXfGNOKystrrn97293_Qot8aMXu-aXp8AX3ZQkZ4xWw0GpTe1c5ZddtsLjHEbYeY20J',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'INR',
              value: this.totalCost.toString(),
              breakdown: {
                item_total: {
                  currency_code: 'INR',
                  value: this.totalCost.toString()
                }
              }
            },
            // items: [

            //   {
            //     name: 'Blink & Buy',
            //     quantity: '1',
            //     category: 'DIGITAL_GOODS',
            //     unit_amount: {
            //       currency_code: 'INR',
            //       value: this.totalCost.toString(),
            //     },
            //   }
            // ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        debugger
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          debugger;
          if (details != null) {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
            this.transactionModel.id = details.id;
            this.transactionModel.create_time = details.create_time;
            this.transactionModel.status = details.status;
            this.transactionModel.payer_email = details.payer.email_address;
            this.transactionModel.payer_id = details.payer.payer_id;
            this.transactionModel.payer_name = details.payer.name.given_name + ' ' + details.payer.name.surname;
            this.transactionModel.amount = details.purchase_units[0].amount.value;
            this.transactionModel.payee_email = details.purchase_units[0].payee.email_address;
            this.transactionModel.merchant_id = details.purchase_units[0].payee.merchant_id;
          };
          this.showSuccess = true;
          this.makeOnlinePayment();
        });
      },
      onClientAuthorization: (data) => {
        debugger
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        debugger
        this.showCancel = true;
        this.sweetAlertService.sweetAlert('Error', "Payment cancelled successfully!", 'error', false);

      },
      onError: err => {
        debugger
        this.showError = true;

        this.sweetAlertService.sweetAlert('Error', "Something bad happend, Error occurred, Please try again!", 'error', false);

      },
      onClick: (data, actions) => {
        debugger
      },
    };
  }




  cashOnDelivery() {
    this.isCashOnDelivery = !this.isCashOnDelivery;
  }

  getCartDetails() {
    this.totalCost = 0;
    this.ngxService.start();
    this.cartService.getCart().subscribe(
      res => {
        this.userCarts = res.body;

        for (let data of this.userCarts) {
          if (data.type == CartType.Product) {
            this.totalCost += data.product.price * data.quantity;
          } else {
            this.totalCost += data.service.price * data.quantity;
          }
        }
        this.ngxService.stop();
      }, error => {
        this.ngxService.stop();
      });
  }

  makePayment(type: string): void {

    if (this.isCashOnDelivery) {
      this.payment.amount = this.totalCost;
      this.payment.paymentStatus = 'Pending';//processing,completed
      this.payment.paymentType = type;
      this.payment.transactionDate = new Date();
      this.payment.transactionNumber = '';

      this.paymentService.makePayment(this.payment).subscribe(
        res => {
          this.sharedService.setCarttoZero();
          this.sweetAlertService.sweetAlert('', "Ordered successfully!", 'success', false);
          this.router.navigateByUrl("/user/dashboard");
        });
    } else {
      this.sweetAlertService.sweetAlert('', "Please Select the checkbox!", 'warn', false);
    }
  }

  makeOnlinePayment(): void {

    this.router.navigateByUrl("/user/dashboard");

  }
}
