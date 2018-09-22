import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorizationService } from '../../services/authorization.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { BasicPage } from '../basic/basic.page';
import { Router } from '@angular/router';
import { IUser } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  extends BasicPage implements OnInit {

  dataForm: FormGroup;
  
  constructor(
    public view:ViewContainerRef,
    private authorizationService: AuthorizationService,
    public route: Router) {
    super(view);
    
    this.dataForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ngOnInit() {
  }

  /**
   * Login user
   */
  login(){
    console.debug("Login with email and password");
    this.beginProcessingWithLoading();
    this.authorizationService.login(this.dataForm.get("email").value, this.dataForm.get("password").value).then((result)=>{
      this.endProcessingWithLoading();
      this.resetForm();
      this.route.navigateByUrl(this.VIEWHOME);
    }).catch((error)=>{
      this.endProcessingWithLoading();
      this.getError(error);
    });
  }

  private resetForm(){
    this.dataForm.reset();
  }

}
