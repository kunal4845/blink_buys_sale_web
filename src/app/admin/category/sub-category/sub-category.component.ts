import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubCategoryModel } from './sub-category.model';
import { SweetAlertService } from '../../../shared/alert/sweetalert.service';
import { CategoryService } from '../category.service';
import { AdminService } from '../../admin.service';
import { ServiceModel } from '../../services/admin-services.model';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  display = 'none';
  isEdit: boolean = false;
  category: SubCategoryModel;
  categoryList: SubCategoryModel[] = [];

  serviceId: number = 0;
  subCategoryId: string = '';
  subCategoryName: string = '';
  description: string = '';
  serviceList: ServiceModel[] = [];

  constructor(
    private categoryService: CategoryService,
    private adminService: AdminService,
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService
  ) {
    this.dtTrigger = new Subject();
    this.category = new SubCategoryModel();
    this.getServices();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getSubCategoryList();

  }

  getServices() {
    this.ngxService.start();
    this.adminService.get('').subscribe(res => {
      this.ngxService.stop();
      this.serviceList = res.body.filter(x => !x.isDeleted);
    }, error => {
      this.ngxService.stop();
    });
  }

  getSubCategoryList() {
    this.ngxService.start();
    this.categoryService.getSubCategoryList('').subscribe(res => {
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }

      this.categoryList = res.body.filter(x => !x.isDeleted);
      this.ngxService.stop();

    }, error => {
      this.ngxService.stop();
    })
  }

  add() {
    this.clear();
    this.openModal();
  }

  openModal() {
    this.display = 'block';
  }

  clear() {
    this.subCategoryName = '';
    this.description = '';
    this.subCategoryId = '0';
    this.serviceId = 0;
  }

  onCloseHandled(form: NgForm) {
    this.clear();
    this.display = 'none';
  }

  edit(category: SubCategoryModel) {
    
    this.subCategoryName = category.subCategoryName;
    this.description = category.description;
    this.subCategoryId = category.id.toString();
    this.serviceId = category.serviceId;
    this.openModal();
  }

  delete(category: SubCategoryModel) {
    
    this.sweetAlertService.sweetAlertConfirm('Delete Confirm!', 'Are you sure you want to delete?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.categoryService.deleteSubCategory(category.id).subscribe(status => {
          this.sweetAlertService.sweetAlert('Success', 'Deleted Successfully', 'success', false);
          this.getSubCategoryList();
        }, error => {
          this.ngxService.stop();
        })
      }
    });
  }

  create() {
    
    this.category.id = +this.subCategoryId;
    this.category.serviceId = +this.serviceId;
    this.category.subCategoryName = this.subCategoryName;
    this.category.description = this.description;
    this.ngxService.start();
    this.isEdit = true;

    this.categoryService.postSubCategory(this.category).subscribe(j => {
      if (this.subCategoryId != '0') {
        this.sweetAlertService.sweetAlert('Success', 'Updated Successfully', 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Success', 'Added Successfully', 'success', false);
      }
      this.getSubCategoryList();
      this.display = 'none';
    }, error => {
      this.ngxService.stop();
    });

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
