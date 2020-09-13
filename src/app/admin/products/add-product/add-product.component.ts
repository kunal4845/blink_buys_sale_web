import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, ProductQuantity, ProductImage } from '../product.model'
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../product.service';

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
  spinner: boolean = false;

  constructor(private productService: ProductService, private _DomSanitizationService: DomSanitizer, private route: ActivatedRoute,
    private router: Router) {
    this.product = new Product();
    this.product.productQuantities.push(new ProductQuantity());
  }

  ngOnInit() {
    this.spinner = true;
    this.route.params
      // (+) converts string 'id' to a number
      .subscribe((params: Params) => {
        
        this.productService.getProductById(+params['id']).subscribe(
          res => {
            this.product = res.body;
            this.spinner = false;
          },
          error => {
            this.spinner = false;
          }
        );
      });


    this.getCuisineType();
    this.getFoodCategory();
    this.getProductCategory();
    this.getProductSubCategory();
  }

  calculateDiscount(index: number) {
    var obj = this.product.productQuantities[index];
    if (obj.newPrice != null && obj.oldPrice != null) {
      obj.discount = ~~(((obj.oldPrice - obj.newPrice) * 100) / obj.oldPrice);
    }
  }

  getProductCategory() {

  }

  getProductSubCategory() {

  }

  getCuisineType() {

  }

  getFoodCategory() {

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
    if (this.productForm.invalid) {
      return;
    }

    if (this.product.productImages.length === 0) {
      this.showAlert('Please upload product image!', "warn", "Required");
      return;
    }

    let isMasterImageSelected = this.product.productImages.filter(x => x.isPrimaryImage);
    if (isMasterImageSelected.length === 0) {
      this.showAlert('Please select the product master image!', "warn", "Required");
      return;
    }

    this.spinner = true;
    this.productService.post(this.product).subscribe(
      (res: any) => {
        this.uploadProductImages(res.body);
      },
      error => {
        this.spinner = false;
        this.showAlert(error.message, "error", "Error");
      }
    );
  }

  uploadProductImages(productId: number) {
    this.productService.uploadProductImages(this.myFiles, productId, this.product.masterImage).subscribe(
      res => {
        this.spinner = false;
        this.showAlert('Product Added Successfully!', "success", "Success");
        this.product = new Product();
        this.myFiles = [];

        //default add a product quantity block.
        this.product.productQuantities.push(new ProductQuantity());
      },
      error => {
        this.spinner = false;
        this.showAlert(error.message, "error", "Error");
      }
    );
  }

  addNewQuantity() {
    var lastIndex = this.product.productQuantities[this.product.productQuantities.length - 1];
    if (lastIndex.newPrice === null || lastIndex.oldPrice === null || lastIndex.quantity === null) {
      this.showAlert('Please fill the required fields!', "warn", "Required");
    } else {
      this.product.productQuantities.push({
        id: this.product.productQuantities.length + 1,
        quantity: null,
        discount: 0,
        oldPrice: null,
        newPrice: null,
        isFreeDelivery: false,
        isAvailable: false,
        productId: 0
      });
    }
  }

  disableOther(image: any) {
    ;
    this.product.productImages.forEach(x => {
      if (x.name === image.name) {
        x.isPrimaryImage = !x.isPrimaryImage;
        this.product.masterImage = x.name;
      } else {
        x.isPrimaryImage = false;
      }
    })
  }

  removeProductQuantity(i: number) {
    if (this.product.productQuantities.length === 1) {
      this.showAlert('Atleast One Quantity and price are mandatory!', "warn", "Required");
    } else {
      this.product.productQuantities.splice(i, 1);
    }
  }

  removeProductImage(i: number) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure that you want to remove this image?',
    //   accept: () => {
    //     this.product.productImages.splice(i, 1);
    //   }, reject: () => {
    //   }
    // });
  }

  resetForm() {
    if (this.productForm.valid) {
      // this.confirmationService.confirm({
      //   message: 'Are you sure that you want clear the form?',
      //   accept: () => {
      //     this.product = new Product();
      //     this.productForm.reset();
      //   }, reject: () => {
      //   }
      // });
    } else {
      this.product = new Product();
      this.productForm.reset();
      this.product.productQuantities.push(new ProductQuantity());
    }
  }

  private showAlert(message, severity, summary) {
    // this.messageService.add({
    //   key: "productKey",
    //   severity: severity,
    //   summary: summary,
    //   detail: message
    // });
  }

}
