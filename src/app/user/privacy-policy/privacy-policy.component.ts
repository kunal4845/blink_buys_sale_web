import { Component, OnInit } from '@angular/core';
import { SiteUrl } from '../../shared/globalConstants';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  siteUrl: string;
  constructor() {

    this.siteUrl = SiteUrl;
  }

  ngOnInit(): void {
  }

}
