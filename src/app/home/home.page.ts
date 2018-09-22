import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { BasicPage } from '../pages/basic/basic.page';
import { AuthorizationService } from '../services/authorization.service';
import { Router } from '@angular/router';
import { SesionService } from '../services/sesion.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BasicPage implements OnInit{
 
  user:any;
  constructor(
    public view:ViewContainerRef,
    private authorizationService: AuthorizationService,
    private sesionService: SesionService,
    public route: Router) {
    super(view);
  }

  ngOnInit(): void {
    this.authorizationService.getUserSesion().then((user)=>{
      this.user = user;
    },(error)=>{
      console.log("Error intentando recuperar el usuario");
    });
  }
  
  logout(){
    this.authorizationService.logout().then((result)=>{
      this.route.navigateByUrl("login");
      this.user == null;
    }).catch((error)=>{
      this.showAlert(error);      
    });
  }
}
