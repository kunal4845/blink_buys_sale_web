import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryModel } from './category.model';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  ////////////
  display = 'none';
  isEdit: boolean = false;
  category: CategoryModel;
  categoryList: CategoryModel[];
  ////////////
  categoryId: string = '';
  categoryName: string = '';
  description: string = '';

  constructor(private adminService: AdminService,
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
    public _DomSanitizationService: DomSanitizer) {
    this.dtTrigger = new Subject();
    this.category = new CategoryModel();
  }

  ngOnInit(): void {
    this.initDataTable();
    this.getCategoryList();
  }

  getCategoryList() {
    this.ngxService.start();
    this.adminService.getCategoryList('').subscribe(res => {
      if (!this.isEdit) {
        this.dtTrigger.next();
      } else {
        this.reRender();
      }
      this.categoryList = res.body.filter(x => x.isDeleted == false);
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
    this.categoryName = '';
    this.description = '';
    this.categoryId = '0';
  }

  onCloseHandled(form: NgForm) {
    this.clear();
    this.display = 'none';
  }

  edit(category: CategoryModel) {
    this.categoryName = category.categoryName;
    this.description = category.description;
    this.categoryId = category.id.toString();
    this.openModal();
  }

  delete(category: CategoryModel) {
    this.sweetAlertService.sweetAlertConfirm('Delete Confirm!', 'Are you sure you want to delete?', 'warning', true).then(confirm => {
      if (confirm.value === true) {
        this.isEdit = true;
        this.ngxService.start();
        this.adminService.deleteCategory(category.id).subscribe(status => {
          this.sweetAlertService.sweetAlert('Success', 'Deleted Successfully', 'success', false);
          this.getCategoryList();
        }, error => {
          this.ngxService.stop();
        })
      }
    });
  }

  create() {
    this.category.id = +this.categoryId;
    this.category.categoryName = this.categoryName;
    this.category.description = this.description;
    this.ngxService.start();
    this.isEdit = true;

    this.adminService.postCategory(this.category).subscribe(j => {
      if (this.categoryId != '') {
        this.sweetAlertService.sweetAlert('Success', 'Updated Successfully', 'success', false);
      } else {
        this.sweetAlertService.sweetAlert('Success', 'Added Successfully', 'success', false);
      }
      this.getCategoryList();
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
