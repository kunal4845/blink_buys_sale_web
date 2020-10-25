import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, ProductImage } from '../product.model'
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../product.service';
import { SweetAlertService } from 'src/app/shared/alert/sweetalert.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryModel } from '../../category/category.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @ViewChild('productForm', { read: NgForm, static: false }) productForm: any;
  productId: number;
  myFiles: File[] = [];
  previewUrl: any = null;
  product: Product;
  categorList: CategoryModel[] = [];

  constructor(private productService: ProductService,
    private _DomSanitizationService: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private sweetAlertService: SweetAlertService) {
    this.product = new Product();
    this.getProductCategory();

  }

  ngOnInit() {
    // this.ngxService.start();

    // this.route.params.subscribe((params: Params) => {
    //   this.productService.getProductById(+params['id']).subscribe(
    //     res => {
    //       this.product = res.body;
    //       this.ngxService.stop();
    //     },
    //     error => {
    //       this.ngxService.stop();
    //     },
    //   );
    // });

  }


  getProductCategory(): void {
    this.ngxService.start();
    this.productService.getProductCategory('').subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.categorList = response.body.filter(x => x.isDeleted == false);
        } this.ngxService.stop();

      },
      (error) => {
        this.ngxService.stop();

        this.sweetAlertService.sweetAlert('Error', error, 'error', false);
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
  }

  preview(file: any) {
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

  submit() {
    debugger
    if (this.productForm.invalid) {
      return;
    }

    if (this.product.productImages.length === 0) {
      this.sweetAlertService.sweetAlert('Required', "Please upload product image!", 'warn', false);
      return;
    }

    let isMasterImageSelected = this.product.productImages.filter(x => x.isPrimaryImage);
    if (isMasterImageSelected.length === 0) {
      this.sweetAlertService.sweetAlert('Required', "Please select the product master image!", 'warn', false);
      return;
    }

    this.ngxService.start();
    this.productService.post(this.product).subscribe(
      (res: any) => {
        debugger
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
        debugger;
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Success', "Product Added Successfully!", 'success', false);
        this.product = new Product();
        this.myFiles = [];
      },
      error => {
        this.ngxService.stop();
        this.sweetAlertService.sweetAlert('Error', error.message, 'error', false);
      }
    );
  }


  disableOther(image: any) {
    debugger;
    this.product.productImages.forEach(x => {
      if (x.name === image.name) {
        x.isPrimaryImage = !x.isPrimaryImage;
        this.product.masterImage = x.name;
      } else {
        x.isPrimaryImage = false;
      }
    })
  }

  removeProductImage(i: number) {
    debugger
    this.sweetAlertService.sweetAlertConfirm('Comfirm removal', 'Are you sure you want to delete?', 'error', false,).then(result => {
      debugger
    }).catch(err => {
      debugger
    });

    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to remove this image?',
    //   accept: () => {
    //     this.product.productImages.splice(i, 1);
    //   }, reject: () => {
    //   }
    // });
  }
}
