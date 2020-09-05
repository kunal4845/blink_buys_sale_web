import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $("#owl-demo5").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items: 4,
      itemsDesktop: [640, 5],
      itemsDesktopSmall: [414, 4],
      navigation: true
    });

  }

}
