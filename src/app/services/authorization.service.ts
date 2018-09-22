import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { IUserSesion } from '../../interfaces/interfaces';
import * as firebase from 'firebase/app';
import { AuthProvider } from '@firebase/auth-types';
import { SesionService } from './sesion.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private angularFireAuth: AngularFireAuth, private sesionService: SesionService ) { }

   /**
   * Login an user with email and passowrd using firebase
   * @param email user email
   * @param password user password
   */
  public login(email:string, password:string){
    let promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email,password).then((result)=>{
        //Create the sesion
        this.createSession(result);        
        resolve(result);
      }).catch((error)=>{
        console.log("Caching error in login");
        reject(error);
      });
    });
    return promise;
  }

  /**
   * Register the user session
   * @param data result of login or signIn
   */
  private createSession(data:any){
    //Create the sesion
    console.log("Creating session..");
    this.sesionService.createSesion(data).then((result)=>{
      console.log("Session create successful");
    }).catch((error)=>{
      console.log("Error to create the session");
    })
  }
  /**
   * Signup an user with email and passowrd using firebase
   * @param email user email
   * @param password user password
   */
  public signUp(email:string, password:string){
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email,password);
  }

  /**
   * Return the user session in a promise
   */
  public getUserSesion():Promise<firebase.User>{
    let promise = new Promise<firebase.User>((resolve,reject)=>{
      this.angularFireAuth.auth.onAuthStateChanged((user)=> {
        resolve(user!=null?user:null);
      },(error)=>{
        reject(error);
      });
    });
    return promise;
  }

  public getSesionChange(){
    return this.angularFireAuth.authState;
  }

  // public getUid(){
  //   if (!this.userSesion){

  //   }
  //   this.getUserSesion().subscribe(data=>{
  //     this.userSesion.email = data.email;
  //     this.userSesion.id = data.uid;
  //   });
  // }

  signInWithGoogle() {
    console.log('Sign in with google');
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    return this.oauthSignIn(provider);
  }

  signInWithFacebook() {
    console.log('Sign in with facebook');
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    return this.oauthSignIn(provider);
  }

  private oauthSignIn(provider: AuthProvider) {
    console.log("Proveedor para el login...", provider);
    let promise = new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      this.angularFireAuth.auth.signInWithPopup(provider).then((result)=>{
        this.createSession(result);
        resolve(result);
      }).catch(      
        (error)=>{
          reject(error);
        });
    });
    return promise;
    
    // if (!(<any>window).cordova) {
    //   console.log("Entrando a signInWithPopup");
    //   return this.angularFireAuth.auth.signInWithPopup(provider);
    // } else {
    //   console.log("Entrando a signInWithRedirect");
    //   return this.angularFireAuth.auth.signInWithRedirect(provider);
    //   // .then(() => {
    //   //   return this.afAuth.auth.getRedirectResult().then(result => {
    //   //     // This gives you a Google Access Token.
    //   //     // You can use it to access the Google API.
    //   //     let token = result.credential.accessToken;
    //   //     // The signed-in user info.
    //   //     let user = result.user;
    //   //     console.log(token, user);
    //   //   }).catch(function (error) {
    //   //     // Handle Errors here.
    //   //     alert(error.message);
    //   //   });
    //   // });
    // }
  }
  
  public getUser(){
    return this.angularFireAuth.auth.currentUser;
  }
  /**
   * Do a logout
   */
  public logout(){
    //Get the user session
    var user = this.angularFireAuth.auth.currentUser;
    console.log("User logout", user);
    //Delete the session active
    if (user){
      this.sesionService.deleteSesion(user.uid);
    }
    return this.angularFireAuth.auth.signOut();
  }

  /**
   * Send and email to recover the password
   * @param email  
   */
  public forgotPassword(email:string){
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  // forgotPassword(){
  //   this.angularFireAuth.auth.sendPasswordResetEmail()
  // }

  // En caso de que ya exista el usuario logueado con gmail, se maneja una fusion de cuentas anexando la credencial del otro proveedor.
// functionhandleDuplicateUser(data) {
//   if(error.code === 'auth/account-exists-with-different-credential') {
//     handleDuplicateUser(error.credential)
//   // se inicia sesión con google pero esta vez pasando el email que devolvio el objeto del error
//   let provider = new firebase.auth.GoogleAuthProvider();
//       provider.setCustomParameters({
//       'login_hint': data.email
//     });

//     firebase.auth().signInWithPopup(provider).then(function(result) {
      
//       // Una vez logueado agrego la nueva credencial al usuario 
//       result.user.linkAndRetrieveDataWithCredential(data.credential).then(result => {
//           console.log('Cuenta fusionada');
//           console.log(result);
//       })
//       .catch(error => {console.log(error)})
//     }).catch(function(error) {
      
//        console.log(error)
//     });

// }

}
