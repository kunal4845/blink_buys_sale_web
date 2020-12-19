import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
declare var $: any;
declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('paypal') paypalElement: ElementRef;
  productList: Product[] = [];
  userCarts: UserCart[] = [];
  totalCost: number = 0;
  billingAddress: BillingAddress;
  isCashOnDelivery: boolean = false;
  payment: PaymentModel;

  planId: any;
  subcripId: any;
  basicAuth = 'Basic QWNWUTBIX05QTVlWMDIzSDhMM3Y2alhNcDRVdaUN2V0M4Mmo4a19hodjdkdS14M3F4dFJ6Y2pNTnRPcGN6OUpPdjU1TW9jTllsEV1p5WURWNm46RUZJRWtJd0dYdDFJSTdFRmlEdVQ3UWExV2ZXWDZnYmw3Z2w5ajgwZVlsVjI1ODdfUTRHSUxCSWxZfOGg1SzRRZTFhMZU1yVgFZGRThIWXAyRjA=';  //Pass your ClientId + scret key

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
    this.getCartDetails();
  }


  ngOnInit(): void {
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

    debugger;
    const self = this;
    this.planId = 'P-20D52460DL479523BLV56M5Y';  //Default Plan Id
    paypal.Buttons({
      createSubscription: function (data, actions) {
        return actions.subscription.create({
          'plan_id': self.planId,
        });
      },
      onApprove: function (data, actions) {
        debugger;
        console.log(data);
        alert('You have successfully created subscription ' + data.subscriptionID);
        self.getSubcriptionDetails(data.subscriptionID);
      },
      onCancel: function (data) {
        debugger;
        // Show a cancel page, or return to cart  
        console.log(data);
      },
      onError: function (err) {
        debugger;
        // Show an error page here, when an error occurs  
        console.log(err);
      }

    }).render(this.paypalElement.nativeElement);

  }


  getSubcriptionDetails(subcriptionId) {
    debugger;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(JSON.parse(this.responseText));
        alert(JSON.stringify(this.responseText));
      }
    };
    xhttp.open('GET', 'https://api.sandbox.paypal.com/v1/billing/subscriptions/' + subcriptionId, true);
    xhttp.setRequestHeader('Authorization', this.basicAuth);

    xhttp.send();
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
}
