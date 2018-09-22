import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BasicPage } from '../basic/basic.page';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthorizationService } from '../../services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage extends BasicPage implements OnInit {

  dataForm: FormGroup;

  constructor(
    public view:ViewContainerRef,
    private authorizationService: AuthorizationService,
    public route: Router) {
    super(view);
    this.dataForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ngOnInit() {
  }

  send(){
    this.authorizationService.forgotPassword(this.dataForm.get("email").value).then((result)=>{
      this.getError("forgotpassword.message");
      this.route.navigateByUrl("login");
    }).catch((error)=>{
      this.getError(error);
      console.error("Error triying to recover the password", error);
    });
  }
}
