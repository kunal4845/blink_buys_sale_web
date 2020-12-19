import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../../login/login.interface';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { SharedService } from '../../../shared/shared.service';
import { CartService } from '../../cart/cart.service';
import { UserCart } from '../../cart/userCart.model';
import { MessageService } from 'primeng/api';
import { UserService } from '../user-service.service';
import { ServiceModel } from '../../../admin/services/admin-services.model';
import { CartType } from '../../../shared/globalConstants';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  service: ServiceModel;
  serviceId: string;
  user: User;
  isLoggedIn: boolean = false;
  userCart: UserCart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private cartService: CartService,
    private sharedService: SharedService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.service = new ServiceModel();
    this.userCart = new UserCart();

    this.route.params.subscribe(params => {
      this.serviceId = params['id'];
      this.getService();
    });
  }

  ngOnInit(): void {
  }

  getService() {
    this.ngxService.start();
    this.userService.get(this.serviceId).subscribe(res => {
      
      this.service = res.body.filter(x => !x.isDeleted && x.isActive)[0];
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
    })
  }

  addToCart(service: ServiceModel) {
    debugger
    if (this.sharedService.getLocalStorage("customerInfo") != null && this.sharedService.getLocalStorage("customerInfo") !== undefined) {
      this.userCart.isDeleted = false;
      this.userCart.bookedItemId = service.id;
      this.userCart.quantity = 1;
      this.userCart.type = CartType.Service;

      this.ngxService.start();
      this.cartService.addToCart(this.userCart).subscribe(
        res => {
          this.ngxService.stop();
          this.sharedService.setCartValue(1);
          this.messageService.add({ severity: 'success', summary: 'Cart', detail: 'Added to cart successfully!' });
          this.router.navigateByUrl("/user/checkout");
        },
        error => {
          this.ngxService.stop();
        }
      );
    } else {
      this.sweetAlertService.sweetAlert('', "Login or register yourself for this action!", 'info', false);
    }
  }

  clear() {
    this.messageService.clear();
  }
}
