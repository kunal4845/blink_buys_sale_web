import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product, ProductImage } from '../product.model'
import { NgForm } from '@angular/forms';
import { ProductService } from '../product.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryModel } from '../../category/category.model';
import { CategoryService } from '../../category/category.service';
import { CommissionPercentage } from 'src/app/shared/globalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { error } from 'protractor';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @ViewChild('productForm', { read: NgForm, static: false }) productForm: any;
  @ViewChild('myInput') myInputVariable: ElementRef;
  productId: number;
  myFiles: File[] = [];
  previewUrl: any = null;
  product: Product;
  categorList: CategoryModel[] = [];
  display: string = '';

  constructor(
    private productService: ProductService,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    public _domSanitizationService: DomSanitizer,
    private router: Router
  ) {
    this.product = new Product();
    this.getProductCategory();

    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId > 0) {
        this.getProductById();
      }
    });
  }

  ngOnInit() {
  }

  getProductById() {
    this.ngxService.start();
    this.productService.getProductById(this.productId).subscribe(
      res => {
        if (res.body.length > 0) {
          this.product = res.body[0];
          // this.product.productImages.forEach(element => {
          //   element.imagePath = 'data:image/jpg;base64,' + (this._domSanitizationService.bypassSecurityTrustResourceUrl(element.imagePath) as any).changingThisBreaksApplicationSecurity;
          // });
        }
        this.ngxService.stop();
      }, error => {
        this.ngxService.stop();
      }
    );
  }

  getProductCategory(): void {
    this.categoryService.getProductCategory('').subscribe(
      response => {
        this.categorList = response.body.filter(x => !x.isDeleted);
      }
    );
  }

  onFileChange(event) {
    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
      //img object
      let img = new ProductImage();
      img.isPrimaryImage = false;
      img.type = event.target.files[i].type;
      img.name = event.target.files[i].name;
      img.size = event.target.files[i].size;
      img.lastModified = event.target.files[i].lastModified;
      img.lastModifiedDate = event.target.files[i].lastModifiedDate;
      // bind with product image array
      this.product.productImages.push(img);
    }
    this.myInputVariable.nativeElement.value = "";
  }

  preview(file: any) {
    debugger
    this.display = 'block';
    if (file?.imagePath != null && file?.imagePath != '') {
      this.previewUrl = file.imagePath;
      return;
    }
    // Show preview
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    var obj = this.myFiles.filter(x => x.name == file.name)[0];
    var reader = new FileReader();
    reader.readAsDataURL(obj);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }


  onCloseHandled() {
    this.display = 'none';
  }

  submit() {
    if (this.productForm.invalid) {
      return;
    };

    if (this.product.productImages.length === 0) {
      this.sweetAlertService.sweetAlert('Required', "Please upload product image!", 'warn', false);
      return;
    };

    let isMasterImageSelected = this.product.productImages.filter(x => x.isPrimaryImage);
    if (isMasterImageSelected.length === 0) {
      this.sweetAlertService.sweetAlert('Required', "Please select the product master image!", 'warn', false);
      return;
    };

    this.product.commissionPercentage = CommissionPercentage;
    this.ngxService.start();
    this.productService.post(this.product).subscribe(
      (res: any) => {
        this.uploadProductImages(res.body);
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error.message, 'error', false);
      }
    );
  }


  uploadProductImages(productId: number) {
    this.productService.uploadProductImages(this.myFiles, productId, this.product.masterImage).subscribe(
      res => {
        this.ngxService.stop();
        if (this.productId > 0) {
          this.sweetAlertService.sweetAlert('Success', "Updated Successfully!", 'success', false);
        } else {
          this.sweetAlertService.sweetAlert('Success', "Added Successfully!", 'success', false);
        }
        this.product = new Product();
        this.myFiles = [];
        this.myInputVariable.nativeElement.value = "";
        this.router.navigateByUrl("/admin/products");
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error.message, 'error', false);
      }
    );
  }


  disableOther(image: any) {
    this.product.productImages.forEach(x => {
      if (x.name === image.name) {
        x.isPrimaryImage = !x.isPrimaryImage;
        this.product.masterImage = x.name;
      } else {
        x.isPrimaryImage = false;
      }
    })
  }

  removeProductImage(i: number, file: any) {
    this.sweetAlertService.sweetAlertConfirm('Comfirm removal', 'Are you sure you want to delete?', 'error', false,).then(result => {
      this.product.productImages.splice(i, 1);
      const myFile = this.myFiles.find(s => s.name === file.name);
      const index: number = this.myFiles.indexOf(myFile);
      if (index !== -1) {
        this.myFiles.splice(index, 1);
      }
    }).catch(err => {
      this.sweetAlertService.sweetAlert('Error', err, 'error', false);
    });
  }
}
