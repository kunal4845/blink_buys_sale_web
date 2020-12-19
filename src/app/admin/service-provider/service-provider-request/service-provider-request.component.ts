import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/login/login.interface';
import { roleType } from 'src/app/shared/globalConstants';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceProviderService } from '../service-provider.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ServiceModel } from '../../services/admin-services.model';
import { CategoryModel } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-service-provider-request',
  templateUrl: './service-provider-request.component.html',
  styleUrls: ['./service-provider-request.component.scss']
})
export class ServiceProviderRequestComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<User> = new Subject();
  display = 'none';
  serviceProviders: User[] = [];
  isEdit: boolean = false;
  categoryList: CategoryModel[] = [];
  previewUrl: any = null;
  title: string;
  serviceList: ServiceModel[];

  constructor(
    private ngxService: NgxUiLoaderService,
    private serviceProviderService: ServiceProviderService,
    private sweetAlertService: SweetAlertService,
    public _DomSanitizationService: DomSanitizer,
    private sharedService: SharedService,
    private categoryService: CategoryService
  ) {
    this.dtTrigger = new Subject();
    this.getServices();
    this.getProductCategory();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getServiceProviders();
  }

  preview(file: any, title: string) {
    this.title = title;
    this.previewUrl = file;
    //  'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(file) as any).changingThisBreaksApplicationSecurity;
  }

  getServiceProviders() {
    this.ngxService.start();
    this.serviceProviderService.getServiceProviders().subscribe(list => {
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this.ngxService.stop();
      this.serviceProviders = list.body.filter(i => i.roleId === roleType.ServiceProvider && !i.isDeleted);
    }, error => {
      this.ngxService.stop();
      this.sweetAlertService.sweetAlert('Error', error, 'error', false);
    });
  }

  getProductCategory(): void {
    this.categoryService.getProductCategory('').subscribe(
      response => {

        this.categoryList = response.body.filter(x => x.isDeleted == false);
      }
    );
  }

  getServices(): void {
    this.sharedService.getServices('').subscribe(
      response => {

        this.serviceList = response.body.filter(x => x.isDeleted == false);
      }
    );
  }

  verifyServiceProvider(serviceProvider: User) {
    this.isEdit = true;
    this.ngxService.start();
    this.serviceProviderService.verifyServiceProvider(serviceProvider.id).subscribe(res => {
      this.getServiceProviders();
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

  deleteServiceProvider(serviceProvider: User) {
    this.sweetAlertService.sweetAlertConfirm('Delete Confirm!', 'Are you sure you want to Delete?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.serviceProviderService.deleteServiceProvider(serviceProvider.id).subscribe(res => {
          this.getServiceProviders();
          if (res.body) {
            this.sweetAlertService.sweetAlert('Success', "Deleted Successfully!", 'success', false);
          } else {
            this.sweetAlertService.sweetAlert('Error', "Some error occured, not deleted!", 'error', false);
          }
          this.ngxService.stop();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
    });
  }

  blockServiceProvider(serviceProvider: User) {
    this.sweetAlertService.sweetAlertConfirm('Block Confirm!', 'Are you sure you want to block?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.serviceProviderService.blockServiceProvider(serviceProvider.id).subscribe(res => {
          this.getServiceProviders();
          if (res.body) {
            this.sweetAlertService.sweetAlert('Success', "Blocked Successfully!", 'success', false);
          } else {
            this.sweetAlertService.sweetAlert('Error', "Some error occured, not blocked!", 'error', false);
          }
          this.ngxService.stop();
        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', error, 'error', false);
        });
      }
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
        { orderable: false, targets: 7 }
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