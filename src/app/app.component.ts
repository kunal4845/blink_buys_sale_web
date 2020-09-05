import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = '';
  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
    
    if (!this.document.body.classList.contains('hold-transition')) {
      this.document.body.classList.add('hold-transition');
    }
    if (!this.document.body.classList.contains('login-page')) {
      this.document.body.classList.add('login-page');
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
