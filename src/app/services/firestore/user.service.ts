import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';
import { User } from '../../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collectionName = 'Users';

  constructor(private afs: AngularFirestore) { }

  create(user: User) {
    return this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  async getById(userId: string): Promise<User | null> {
    try {
      const doc = await firstValueFrom(
        this.afs.collection<User>(this.collectionName).doc(userId).get()
      );
      
      if (doc.exists) {
        const data = doc.data() as User;
        return { ...data, id: doc.id };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  update(user: User): Promise<void> {
    return this.afs
      .collection<User>(this.collectionName)
      .doc(user.id)
      .update(user);
  }

  async delete(userId: string): Promise<void> {
    return this.afs
      .collection<User>(this.collectionName)
      .doc(userId)
      .delete();
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await firstValueFrom(
        this.afs.collection<User>(this.collectionName).get()
      );
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }
}
