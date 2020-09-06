import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { roleType } from 'src/app/shared/globalConstants';
import { DealerService } from '../dealer.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';

@Component({
  selector: 'app-dealer-request',
  templateUrl: './dealer-request.component.html',
  styleUrls: ['./dealer-request.component.scss']
})
export class DealerRequestComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();
  display = 'none';
  dealers: User[] = [];
  isEdit: boolean = false;

  constructor(private ngxService: NgxUiLoaderService, private dealerService: DealerService, private sweetAlertService: SweetAlertService) {
    this.dtTrigger = new Subject();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getDealers();
  }

  getDealers() {
    this.ngxService.start();
    this.dealerService.getDealers().subscribe(list => {
      this.ngxService.stop();
      this.dealers = list.body.filter(i => i.roleId === roleType.Dealer);
    }, error => {
      this.ngxService.stop(); this.sweetAlertService.sweetAlert('Error', error, 'error', false);

    });
    if (!this.isEdit) {
      this.dtTrigger.next();
    } else {
      this.reRender();
    }
  }

  verifyDealer(dealer: User) {
    this.ngxService.start();
    this.dealerService.verifyDealer(dealer.id).subscribe(res => {
      debugger
      if (res.body) {
        this.sweetAlertService.sweetAlert('Success', "Verified Successfully!", 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Error', "Some error occured, not verified!", 'error', false);
      }
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

  deleteDealer(dealer: User) {
    this.ngxService.start();
    this.dealerService.deleteDealer(dealer.id).subscribe(res => {
      debugger
      if (res.body) {
        this.sweetAlertService.sweetAlert('Success', "Deleted Successfully!", 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Error', "Some error occured, not deleted!", 'error', false);
      }
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop(); this.sweetAlertService.sweetAlert('Error', error, 'error', false);

    });
  }

  blockDealer(dealer: User) {
    this.ngxService.start();
    this.dealerService.blockDealer(dealer.id).subscribe(res => {
      debugger
      if (res.body) {
        this.sweetAlertService.sweetAlert('Success', "Blocked Successfully!", 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Error', "Some error occured, not blocked!", 'error', false);
      }
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop(); this.sweetAlertService.sweetAlert('Error', error, 'error', false);

    });
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
        { orderable: false, targets: 3 }
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
