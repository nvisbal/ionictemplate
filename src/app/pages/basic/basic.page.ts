import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationService } from '../../services/authorization.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../../interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.page.html',
  styleUrls: ['./basic.page.scss'],
})
export class BasicPage {

  private loading;
  private processing;
  private urlParameters: Array<any> = [];
  private title: string;

  alertCtrl: AlertController;
  loadingCtrl: LoadingController;
  translateService: TranslateService;
  route: Router;
  protected VIEWHOME:string = "home";

  constructor(public view:ViewContainerRef) {
    this.alertCtrl = this.view.injector.get(AlertController);
    this.loadingCtrl = this.view.injector.get(LoadingController);
    this.translateService = this.view.injector.get(TranslateService);
    this.translateService.get("alert.title").subscribe(val => this.title = val);
  }

  /**
   * displays a request dialog box to select yes or no
   */
  // showConfirmDelete() {
  //     var promise = new Promise((resolve, reject) => {

  //         const confirm = this.alertCtrl.create({
  //             title: 'Confirmación de eliminación',
  //             message: '¿Desea eliminar el valor seleccionado?',
  //             buttons: [
  //               {
  //                 text: 'No',
  //                 handler: () => {
  //                     resolve(false);
  //                 }
  //               },
  //               {
  //                 text: 'Si',
  //                 handler: () => {
  //                     resolve(true);
  //                 }
  //               }
  //             ]
  //           });

  //         confirm.present();

  //       });
  //     return promise;

  // }

  /**
   * Muestra una alerta al usuario
   * @param msg mensaje a mostrar. El título es "Información"
   */
  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: this.title,
      message: msg,
      buttons: ['OK']

    });
    alert.present();
    return alert;
  }

  /**
   * Show the message alert by looking for the text in the translation document
   * @param codeMsg code to find in the translation document
   */
  showAlertByCode(codeMsg: string) {
    this.translateService.get(codeMsg).subscribe(val => {
      this.showAlert(val);
    });
  }

  // showAlertWithOutButton(msg: string) {
  //     const alert = this.alertCtrl.create({
  //         title: this.title,
  //         subTitle: msg
  //     });
  //     alert.present();
  //     return alert;
  // }

  /**
  * Muestra la ventana de carga con el mensaje "Por favor espere, se está procesando su solicitud..."
  */
  showLoading() {
    this.translateService.get("alert.wait").subscribe(val => {
      this.showLoadingText(val);
    });
  }

  /**
   * Muestra la ventana de carga con el mensaje recibido.
   * @param msg mensaje que se desea mostrar
   */
  async showLoadingText(msg: string) {
    this.loading = await this.loadingCtrl.create({
      message: msg,
      duration: 10000
    });
    return this.loading.present();
  }

  hideLoading() {
    if (this.loading != null)
      this.loading.dismiss();
  }

  protected beginProcessing() {
    this.processing = true;
  }

  protected beginProcessingWithLoading() {
    this.processing = true;
    this.showLoading();
  }

  protected endProcessing() {
    this.processing = false;
  }

  protected endProcessingWithLoading() {
    this.processing = false;
    this.hideLoading();
  }

  isProcessing() {
    return this.processing;
  }

  /**
   * Obtiene los parámetros que vienen por el URL
   */
  getParamsByURL() {
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams) {
        let singleURLParam = splitParams[i].split('=');
        let urlParameter = {
          'name': singleURLParam[0],
          'value': singleURLParam[1]
        }
        this.urlParameters.push(urlParameter);
      }
    }
  }

  getParam(key: string) {
    console.log(this.urlParameters);
    var object = this.urlParameters.filter(obj =>
      obj.name === key
    );
    return object.length > 0 ? object[0].value : null;
  }

  /**
   * Try to find the right message in the translate document. Can receive and text or and objet error.code, error.message
   * @param error string or objet of type error rest.
   */
  getError(error) {
    console.log("Error", error);

    if (error && (typeof error === "string" || error.code)){
      var code = typeof error === "string"?error:error.code!== "undefined"?error.code:"alert.error";
    }

    this.translateService.get(code).subscribe(val => {
      if (code == val){
        if (error.code!== "undefined" && error.message.length > 0)
          this.showAlert(error.message);
      }else{
        this.endProcessingWithLoading();
        this.showAlert(val);
      }
    });
  }

  /**
   * Retorna verdadero si el valor es nulo o blanco
   * @param val valor a evaluar.
   */
  isNullOrBlank(name: string, val) {
    console.log("Evaluando", name, val === null || val === "" || typeof val === "undefined");
    return val === null || val === "" || typeof val === "undefined" ? true : false;
  }

  /**
   * Create an account with google credencials
   */
  public signUpWithGoogle() {
    console.log("SignIn with google");
    let authorizationService: AuthorizationService;
    let userService: UserService;
    let router: Router;
    authorizationService = this.view.injector.get(AuthorizationService);
    userService = this.view.injector.get(UserService);
    router = this.view.injector.get(Router);

    authorizationService.signInWithGoogle().then((result) => {
      let objProfile: any = result.additionalUserInfo.profile;
      //If the user is new then create a new one
      if (result.additionalUserInfo.isNewUser) {
        let user: IUser = {
          uid: result.user.uid,
          firstname: objProfile.given_name,
          lastname: objProfile.family_name,
          email: result.user.email,
          photo: result.user.photoURL,
          active: true
        }
        userService.createUser(user).then(response => {
          router.navigateByUrl(this.VIEWHOME);
          this.endProcessingWithLoading();
        }).catch(error => {
          this.endProcessingWithLoading();
          this.showAlert(error.message);
        });
      } else {
        router.navigateByUrl(this.VIEWHOME);
      }
    }).catch((error) => {
      console.log("Error registrando el usuario con google", error);
      this.endProcessingWithLoading();
      this.showAlertByCode("signup.errorwithgoogle");
    });
  }

  public signUpWithFacebook() {
    console.debug("SignUp with facebook");    
    let authorizationService: AuthorizationService;
    let userService: UserService;
    authorizationService = this.view.injector.get(AuthorizationService);
    userService = this.view.injector.get(UserService);
    let router: Router;
    router = this.view.injector.get(Router);

    authorizationService.signInWithFacebook().then((result) => {

      let objProfile: any = result.additionalUserInfo.profile;
      //If the user is new then create a new one
      if (result.additionalUserInfo.isNewUser) {
        let user: IUser = {
          uid: result.user.uid,
          firstname: objProfile.first_name,
          lastname: objProfile.last_name,
          email: result.user.email,
          photo: result.user.photoURL,
          active: true
        }
        userService.createUser(user).then(response => {
           router.navigateByUrl(this.VIEWHOME);
          this.endProcessingWithLoading();
        }).catch(error => {
          this.endProcessingWithLoading();
          this.showAlert(error.message);
        });
      } else {
         router.navigateByUrl(this.VIEWHOME);
      }
    }).catch((error) => {
      this.showAlertByCode("signup.errorwithfacebook");
      console.log("Error registrando el usuario con facebook");
    });
  }

}
