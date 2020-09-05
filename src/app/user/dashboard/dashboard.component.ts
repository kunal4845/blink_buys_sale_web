import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $('#myModal88').modal('show');

    $("#owl-demo1").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items: 4,
      itemsDesktop: [640, 5],
      itemsDesktopSmall: [414, 4],
      navigation: true
    });
    
    $("#owl-demo2").owlCarousel({
      autoPlay: 3000, //Set AutoPlay to 3 seconds
      items: 4,
      itemsDesktop: [640, 5],
      itemsDesktopSmall: [414, 4],
      navigation: true
    });

  }
}
