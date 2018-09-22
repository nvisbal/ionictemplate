import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BasicPage } from '../basic/basic.page';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends BasicPage implements OnInit {

  dataForm: FormGroup;

  constructor(
    public view:ViewContainerRef,
    private authorizationService: AuthorizationService,
    private userService: UserService,
    public route: Router) {
    super(view);
    this.dataForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      firstname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ]))
    });
  }

  ngOnInit() {
  }

  /**
   * Register the user in the database
   */
  public signUp() {
    this.beginProcessingWithLoading();
    this.authorizationService.signUp(this.dataForm.get("email").value, this.dataForm.get("password").value).then((response) => {
      this.authorizationService.getUserSesion().then((data) => {
        //Get the user sesion
        if (data !== null) {
          let user: IUser = {
            uid: data.uid,
            firstname: this.dataForm.get("firstname").value,
            lastname: this.dataForm.get("lastname").value,
            email: this.dataForm.get("email").value,
            active: true
          }

          //Create the user
          this.userService.createUser(user).then(response => {
            this.endProcessingWithLoading();
            this.route.navigateByUrl(this.VIEWHOME);
          }).catch(error => {
            this.endProcessingWithLoading();
            this.showAlert(error.message);
          });
        }
      });
    }).catch((error) => {
      this.endProcessingWithLoading();
      this.getError(error);
      console.log("Error registrando el usuario");
    })
  }

  public resetForm() {
    this.dataForm.reset();
  }
}
