import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ISesion } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  node="sesion"
  constructor(private firestore: AngularFirestore) {}

  /**
   * Create the user session in the database.
   * @param data 
   */
  public createSesion(data:any){
    //Create in the node sesion the uid and the some basic data
    if (data){      
      let sesion:ISesion = {
        uid:data.user.uid,
        displayName:data.user.displayName,
        email:data.user.email,
        createdAt: Date.now()
      }
      return this.firestore.doc(this.node+"/"+sesion.uid).set(sesion);
    }
  }

  /**
   * delete the user session.
   * @param id id of the user or session.
   */
  public deleteSesion(id:string){
    return this.firestore.doc(this.node+"/"+id).delete();
  }

}
