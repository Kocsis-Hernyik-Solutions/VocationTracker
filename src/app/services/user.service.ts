import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly collectionName = 'users';

  constructor(private firestore: Firestore) { }

  async getById(userId: string): Promise<User | null> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() as Omit<User, 'id'> };
    }
    return null;
  }

  getUserById(userId: string): Observable<User | null> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    return from(getDoc(userRef)).pipe(
      map(userSnap => {
        if (userSnap.exists()) {
          return { id: userSnap.id, ...userSnap.data() as Omit<User, 'id'> };
        }
        return null;
      })
    );
  }

  async create(user: User): Promise<void> {
    const { id, ...userData } = user;
    await setDoc(doc(this.firestore, this.collectionName, id), userData);
  }

  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    await setDoc(userRef, {
      email: userData.email,
      name: userData.name || '',
      position: userData.position || '',
      department: userData.department || '',
      role: userData.role || 'user',
      remainingDays: userData.remainingDays || 20
    });
  }

  async update(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    await updateDoc(userRef, userData);
  }

  async updateRemainingDays(userId: string, daysToSubtract: number): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnap.data() as User;
    const currentDays = userData.remainingDays || 0;
    const newDays = Math.max(0, currentDays - daysToSubtract); // Ensure we don't go below 0

    await updateDoc(userRef, {
      remainingDays: newDays,
      updatedAt: new Date()
    });
  }

  async delete(userId: string): Promise<void> {
    const userRef = doc(this.firestore, this.collectionName, userId);
    await deleteDoc(userRef);
  }

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(this.firestore, this.collectionName);
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<User, 'id'>
    }));
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return null;
    }
    return this.getById(userId);
  }
}
