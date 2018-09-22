import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './services/authorization.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages;

  user:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private authorizationService: AuthorizationService,
    public route: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

     // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang("en");
      // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use("en");

    //Get user session
    this.authorizationService.getSesionChange().subscribe((user)=>{
      if (user){
        this.user = user;
        this.setPages();
      }else{
        this.appPages = null;
      }
    })
  }

  setPages(){
    this.appPages = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'Properties',
        url: '/list',
        icon: 'list'
      }
    ]
  }
}
