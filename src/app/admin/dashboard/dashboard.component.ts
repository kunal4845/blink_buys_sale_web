import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { roleType } from 'src/app/shared/globalConstants';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { DealerService } from '../dealer/dealer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  count: number;
  dealers: number;
  serviceProviders: number;
  customers: number;

  constructor(private ngxService: NgxUiLoaderService,
    private dealerService: DealerService,
    private sweetAlertService: SweetAlertService) {
  }


  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.dealerService.getDealers().subscribe(list => {
      debugger
      this.dealers = list.body.filter(i => i.roleId === roleType.Dealer && !i.isDeleted).length;
      this.serviceProviders = list.body.filter(i => i.roleId === roleType.ServiceProvider && !i.isDeleted).length;
      this.customers = list.body.filter(i => i.roleId === roleType.User && !i.isDeleted).length;
    });
  }
}
