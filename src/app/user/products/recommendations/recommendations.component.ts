import { AfterContentInit, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Product } from 'src/app/admin/products/product.model';
import { ProductService } from 'src/app/admin/products/product.service';
declare var $: any;

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit, AfterContentInit {
  productList: Product[] = [];
  constructor(private productService: ProductService,
    private sanitizer: DomSanitizer) { }

  ngAfterContentInit() {
    //set timeout for owlCarousel to load.
    setTimeout(function () {
      $("#owl-demo5").owlCarousel({
        autoPlay: 3000, //Set AutoPlay to 3 seconds
        items: 4,
        itemsDesktop: [640, 5],
        itemsDesktopSmall: [414, 4],
        navigation: true,
        loop: true,
        rewind: false
      });
    }, 2000);
  }
  

  ngOnInit(): void {
    this.getRecommendedProducts();
  }

  transform(path: any) {
    //Call this method in the image source, it will sanitize it.
    return 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(path) as any).changingThisBreaksApplicationSecurity;
  }

  getRecommendedProducts() {
    this.productService.getRecommendedProducts().subscribe(
      res => {
        debugger;
        this.productList = res.body;
      }
    );
  }

  addToCart(product: Product) {


  }
}
