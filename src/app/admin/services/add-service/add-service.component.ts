import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceModel } from '../admin-services.model';
import { User } from 'src/app/login/login.interface';
import { AdminService } from '../../admin.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  ////////////
  user: User;
  display = 'none';
  isEdit: boolean = false;
  service: ServiceModel;
  serviceList: ServiceModel[];
  ////////////
  selectedIdFile: File = null;
  serviceId: string;
  serviceName: string = '';
  description: string = '';
  previewUrl: any = null;

  constructor(private adminService: AdminService,
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
    public _DomSanitizationService: DomSanitizer) {
    this.dtTrigger = new Subject();
    this.service = new ServiceModel();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getServices();
  }

  getServices() {
    this.ngxService.start();
    this.adminService.get('').subscribe(res => {
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this.serviceList = res.body.filter(x => x.isDeleted == false);
      this.ngxService.stop();
    }, error => {
      this.ngxService.stop();
    })


  }

  upload(fileInput: any) {
    this.selectedIdFile = <File>fileInput.target.files[0];
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  add() {
    this.clear();
    this.openModal();
  }

  openModal() {
    this.display = 'block';
  }

  clear() {
    this.serviceName = '';
    this.description = '';
    this.myInputVariable.nativeElement.value = "";
    this.previewUrl = ''
    this.serviceId = '0';
  }

  onCloseHandled(form: NgForm) {
    this.clear();
    this.display = 'none';
  }

  edit(service: ServiceModel) {
    this.serviceName = service.serviceName;
    this.description = service.description;
    this.previewUrl = 'data:image/jpg;base64,' + (this._DomSanitizationService.bypassSecurityTrustResourceUrl(service.serviceIcon) as any).changingThisBreaksApplicationSecurity;
    this.serviceId = service.id.toString();
    this.openModal();
  }

  delete(serviceModel: ServiceModel) {
    this.sweetAlertService.sweetAlertConfirm('Delete Confirm!', 'Are you sure you want to delete?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.adminService.delete(serviceModel.id).subscribe(status => {
          this.sweetAlertService.sweetAlert('Success', 'Deleted Successfully', 'success', false);
          this.getServices();
          this.ngxService.stop();
        }, error => {
          this.ngxService.stop();
        })
      }
    });
  }

  create() {
    if (this.selectedIdFile === null && this.previewUrl == '') {
      this.sweetAlertService.sweetAlert('', 'Upload service icon!', 'warn', false);
      return;
    }

    if (this.selectedIdFile) {
      if (this.serviceId === undefined) {
        this.serviceId = '0';
      }
      let file: File = this.selectedIdFile;
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('ServiceIcon', file.name);
      formData.append('Id', this.serviceId);
      formData.append('ServiceName', this.serviceName);
      formData.append('Description', this.description);
      this.ngxService.start(); this.isEdit = true;

      this.adminService.post(formData).subscribe(j => {
        this.getServices();
        this.sweetAlertService.sweetAlert('Success', 'Added Successfully', 'success', false);
        this.display = 'none';
      }, error => {
        this.ngxService.stop();
      });
    }
    else {
      this.service.id = +this.serviceId;
      this.service.serviceName = this.serviceName;
      this.service.description = this.description;
      this.service.serviceIcon = this.previewUrl;
      this.ngxService.start(); this.isEdit = true;

      this.adminService.postService(this.service).subscribe(j => {
        this.sweetAlertService.sweetAlert('Success', 'Updated Successfully', 'success', false);
        this.getServices();
        this.display = 'none';
      }, error => {
        this.ngxService.stop();
      });
    }
  }

  private initDataTable(): void {
    this.dtOptions = {
      pagingType: 'simple_numbers',
      pageLength: 10,
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
