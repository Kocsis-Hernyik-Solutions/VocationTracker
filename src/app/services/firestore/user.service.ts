import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { User } from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionNames = 'Users';
  user : User | any;


  constructor(private afs: AngularFirestore) { }

  create(user: User){
   return this.afs.collection<User>(this.collectionNames).doc(user.id).set(user);
  }

  userById(userId: string){
    return this.afs.collection<User>(this.collectionNames).doc(userId).valueChanges();
  }

  updateUser(userId: string, updatedData: Partial<User>): Promise<void> {
    // Az AngularFirestore-on keresztül hivatkozunk a felhasználó dokumentumára
    const userRef = this.afs.collection<User>(this.collectionNames).doc(userId);

    // Frissítjük a dokumentumot az új adatokkal
    return userRef.update(updatedData);
  }

}
