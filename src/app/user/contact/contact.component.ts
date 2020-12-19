import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SweetAlertService } from '../../shared/alert/sweetalert.service';
import { EMAIL_PATTERN } from '../../shared/globalConstants';
import { ContactUsModel } from './contact-us.model';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactUs: ContactUsModel;
  emailPattern = EMAIL_PATTERN;

  constructor(
    private contactUsService: ContactUsService,
    private sweetAlertService: SweetAlertService,
    private ngxService: NgxUiLoaderService,
  ) {
    this.contactUs = new ContactUsModel();
  }

  submit(form: NgForm) {
    debugger
    if (form.valid) {
      this.ngxService.start();
      this.contactUs.isActive = true;

      this.contactUsService.post(this.contactUs).subscribe(
        userResponse => {
          debugger
          this.ngxService.stop();
          form.reset();
          this.sweetAlertService.sweetAlert('Succes', "Thank you for writing with us. We will resolve your query soon!", 'success', false);

        }, error => {
          this.ngxService.stop();
          this.sweetAlertService.sweetAlert('Error', "Something went wrong!", 'error', false);
        });
    }
  }
}
