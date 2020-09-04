import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/login/login.interface';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/loginservice';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../../shared/globalConstants';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  user: User;
  emailPattern = EMAIL_PATTERN;
  passwordPattern = PASSWORD_PATTERN;
  constructor(private sharedService: SharedService, private router: Router,
    private userService: LoginService

  ) {
    this.user = new User();
  }

  ngOnInit(): void {
  }

  register(registerForm: NgForm): void {
    debugger;
    if (this.user.email != "" && this.user.password != "" && this.user.confirmPassword != "" && this.user.name != "" &&
      this.user.password == this.user.confirmPassword) {
      this.userService.userRegister(this.user).subscribe(
        (userResponse: any) => {
          if (userResponse.status === 200) {
            localStorage.setItem("token", userResponse.body.token);
            this.sharedService.setLocalStorage("Email", userResponse.body);
            registerForm.reset();
            this.router.navigateByUrl("/admin/dashboard");
          }
        },
        error => {

        }
      );
    }
  }

}
