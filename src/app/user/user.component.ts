import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) {
    debugger
    this.document.body.classList.remove('hold-transition');

    this.document.body.classList.remove('login-page');

      // document.styleSheets[0].disabled = true;
    // document.styleSheets[1].disabled = true;
    // document.styleSheets[2].disabled = true;
    // document.styleSheets[3].disabled = true;
    // document.styleSheets[4].disabled = true;
    // document.styleSheets[5].disabled = true;
    // document.styleSheets[6].disabled = true;
    // document.styleSheets[7].disabled = true;
    // document.styleSheets[8].disabled = true;
    // document.styleSheets[9].disabled = true;
    // document.styleSheets[10].disabled = true;
    
    // document.styleSheets[11].disabled = true;
    // document.styleSheets[12].disabled = true;
    // document.styleSheets[13].disabled = true;
    // document.styleSheets[14].disabled = true;
    // document.styleSheets[15].disabled = true;
    // document.styleSheets[16].disabled = true;
    // document.styleSheets[17].disabled = true;
    // document.styleSheets[18].disabled = true;
    // document.styleSheets[19].disabled = true;
    // document.styleSheets[20].disabled = true;
  }

  ngOnInit(): void {
    $("#owl-demo").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds 
      items: 4,
      itemsDesktop: [640, 5],
      itemsDesktopSmall: [480, 2],
      navigation: true

    });
  }
}
