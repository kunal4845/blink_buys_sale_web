import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  counter: number = 0;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.body.classList.remove('hold-transition');
    this.document.body.classList.remove('login-page');

    this.incrementAndShowValue();
  }

  ngOnInit(): void {
  }

  incrementAndShowValue() {
    var value = this.getCookie("visitcounter") || 0;
    var newValue = ("00000" + (Number(value) + 1)).slice(-6);
    var container = document.getElementById("counterVisitor");
    String(newValue).split("").forEach(function (item, index) {
      container.children[index].innerHTML = item;
    });
    this.counter++;
    this.setCookie("visitcounter", this.counter, 15);
  }

  setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=https://stacksnippets.net/js";
  }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

}
