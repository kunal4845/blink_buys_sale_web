import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from '../../login/login.interface';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryModel } from '../category/category.model';
import { DealerService } from './dealer.service';
import { ProductService } from '../products/product.service';
import { roleType } from '../../shared/globalConstants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit {
  dealers: User[] = [];
  dealer = new User()
  categoryList: CategoryModel[] = [];
  previewUrl_idProofPath: any = null;
  previewUrl_cancelledChequePath: any = null;
  dealerId: number;

  constructor(private ngxService: NgxUiLoaderService,
    private dealerService: DealerService,
    private sweetAlertService: SweetAlertService,
    private productService: ProductService,
    public _DomSanitizationService: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router) {
    this.getProductCategory();

    this.route.params.subscribe(params => {
      debugger
      this.dealerId = params['id'];
    });
  }

  ngOnInit(): void {
    this.getDealers();
  }

  getProductCategory(): void {
    this.ngxService.start();
    this.productService.getProductCategory('').subscribe(
      (response: any) => {
        this.categoryList = response.body;
        this.ngxService.stop();
      },
      (error) => {
        this.ngxService.stop();
      }
    );
  }

  getDealers() {
    this.ngxService.start();
    this.dealerService.getDealers().subscribe(list => {
      this.ngxService.stop();
      this.dealers = list.body.filter(i => i.roleId === roleType.Dealer && !i.isDeleted && i.id === +this.dealerId);
      if (this.dealers.length > 0) {
        this.dealer = this.dealers[0];

        debugger
        this.previewUrl_cancelledChequePath = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.dealer.cancelledChequePath) as any).changingThisBreaksApplicationSecurity;

        this.previewUrl_idProofPath = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(this.dealer.idProofPath) as any).changingThisBreaksApplicationSecurity;


      };
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

}
