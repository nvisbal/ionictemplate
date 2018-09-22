import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IUser } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  node="users"
  constructor(private firestore: AngularFirestore) {}

  public createUser(user:IUser){
    // return this.angularFireDataBase.object(this.node + user.uid).set(user);
    // return this.firestore.collection(this.node).add(user);
    return this.firestore.doc(this.node+"/"+user.uid).set(user);
  }

  // public getById(id:string){
  //   return this.angularFireDataBase.list(this.node + id);
  // }

  

}
