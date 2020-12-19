import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';
import { ServiceModel } from 'src/app/admin/services/admin-services.model';
import { User } from 'src/app/login/login.interface';
import { LoginService } from 'src/app/login/loginservice';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { CartType } from 'src/app/shared/globalConstants';
import { SharedService } from 'src/app/shared/shared.service';
import { CartService } from '../../cart/cart.service';
import { UserCart } from '../../cart/userCart.model';
import { UserService } from '../user-service.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  isOpen: boolean = false;
  serviceList: ServiceModel[] = [];
  tempServiceList: ServiceModel[] = [];
  userCart: UserCart;
  user: User;

  issSelected_100: boolean = false;
  issSelected_200: boolean = false;
  issSelected_250: boolean = false;
  issSelected_300: boolean = false;
  issSelected_400: boolean = false;
  issSelected_500: boolean = false;
  moreSelected: boolean = false;

  constructor(
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private messageService: MessageService,
    private cartService: CartService,
    private router: Router,
    private loginService: LoginService,
    private sharedService: SharedService
  ) {
    this.userCart = new UserCart();
    this.user = new User();
  }

  ngOnInit(): void {
    this.getServices();debugger
    //check if user logged in
    if (this.sharedService.getLocalStorage("customerInfo") !== null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {
      this.getUser();
    };
  }

  getUser() {
    this.loginService.getUser().subscribe(
      userResponse => {
        this.user = userResponse.body;
      }
    );
  }

  clickEvent() {
    this.isOpen = !this.isOpen;
  }

  getServices() {
    this.ngxService.start();
    this.userService.get('').subscribe(
      res => {

        this.serviceList = res.body.filter(x => !x.isDeleted && x.isActive);
        this.tempServiceList = res.body.filter(x => !x.isDeleted && x.isActive);
        this.ngxService.stop();
      },
      error => {
        this.ngxService.stop();
      }
    );
  }

  checkWhichCheckboxSelected() {
    if (this.moreSelected) {
      this.serviceList = this.tempServiceList.sort((a, b) => b.price - a.price); // For descending sort
    }
    else if (this.issSelected_500) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 500);
    }
    else if (this.issSelected_400) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 400);
    }
    else if (this.issSelected_300) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 300);
    }
    else if (this.issSelected_250) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 250);
    }
    else if (this.issSelected_200) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 200);
    }
    else if (this.issSelected_100) {
      this.serviceList = this.tempServiceList.filter(x => !x.isDeleted && x.isActive && x.price <= 100);
    } else {
      this.serviceList = this.tempServiceList.sort((a, b) => a.price - b.price); // For descending sort
    }
  }

  sortByPrice(price: string) {

    if (price == 'more') {
      this.moreSelected = !this.moreSelected;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '500') {
      this.issSelected_500 = !this.issSelected_500;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '400') {
      this.issSelected_400 = !this.issSelected_400;
      this.checkWhichCheckboxSelected()
    }

    else if (price == '300') {
      this.issSelected_300 = !this.issSelected_300;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '250') {
      this.issSelected_250 = !this.issSelected_250;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '200') {
      this.issSelected_200 = !this.issSelected_200;
      this.checkWhichCheckboxSelected()
    }
    else if (price == '100') {
      this.issSelected_100 = !this.issSelected_100;
      this.checkWhichCheckboxSelected()
    }
    else if (price == 'high') {
      this.serviceList = this.tempServiceList.sort((a, b) => b.price - a.price); // For descending sort
    }
    else if (price == 'low') {
      this.serviceList = this.tempServiceList.sort((a, b) => a.price - b.price); // For asc sort
    }
    else if (price == 'latest') { // For latest sort
      this.serviceList = this.tempServiceList.sort((a: ServiceModel, b: ServiceModel) => {
        return this.getTime(b.createdDt) - this.getTime(a.createdDt);
      });
    }
  }

  addToCart(service: ServiceModel) {

    if (this.user.id > 0) {
      this.ngxService.start();
      this.userCart.isDeleted = false;
      this.userCart.bookedItemId = service.id;
      this.userCart.quantity = 1;
      this.userCart.userId = this.user.id;
      this.userCart.type = CartType.Service;

      this.cartService.addToCart(this.userCart).subscribe(
        res => {
          this.ngxService.stop();
          this.sharedService.setCartValue(1);
          this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Added to cart successfully!' });
        },
        error => {
          this.ngxService.stop();
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('', "Login or register for adding item in cart!", 'info', false);
    }
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime()
      : 0;
  }
}
