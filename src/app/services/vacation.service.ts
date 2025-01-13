import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VacationRequest, RequestStatus } from '../models/vacation-request.model';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  DocumentReference,
  DocumentData
} from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private readonly collectionName = 'vacation-requests';

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // Összes kérelem lekérése
  getAllRequests(): Observable<VacationRequest[]> {
    const requestsRef = collection(this.firestore, this.collectionName);
    return collectionData(requestsRef, { idField: 'id' }).pipe(
      map(requests => this.convertDates(requests as VacationRequest[]))
    );
  }

  // Egy kérelem lekérése ID alapján
  async getRequestById(id: string): Promise<VacationRequest | null> {
    const requestsRef = collection(this.firestore, this.collectionName);
    const q = query(requestsRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const request = querySnapshot.docs[0].data() as VacationRequest;
      request.id = querySnapshot.docs[0].id;
      return this.convertDates([request])[0];
    }
    
    return null;
  }

  // Új kérelem létrehozása
  async createRequest(request: Partial<VacationRequest>): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user!');

    const requestData = {
      ...request,
      userId: user.uid,
      status: RequestStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const requestsRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(requestsRef, requestData);
    return docRef.id;
  }

  // Kérelem módosítása
  async updateRequest(id: string, request: Partial<VacationRequest>): Promise<void> {
    const requestRef = doc(this.firestore, this.collectionName, id);
    const updateData = {
      ...request,
      updatedAt: new Date()
    };
    await updateDoc(requestRef, updateData);
  }

  // Kérelem törlése
  async deleteRequest(id: string): Promise<void> {
    const requestRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(requestRef);
  }

  // Felhasználó saját kérelmeinek lekérése
  getUserRequests(): Observable<VacationRequest[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user!');

    const requestsRef = collection(this.firestore, this.collectionName);
    const q = query(requestsRef, where('userId', '==', user.uid));
    return collectionData(q, { idField: 'id' }).pipe(
      map(requests => this.convertDates(requests as VacationRequest[]))
    );
  }

  // Függőben lévő kérelmek lekérése
  getPendingRequests(): Observable<VacationRequest[]> {
    const requestsRef = collection(this.firestore, this.collectionName);
    const q = query(requestsRef, where('status', '==', RequestStatus.PENDING));
    return collectionData(q, { idField: 'id' }).pipe(
      map(requests => this.convertDates(requests as VacationRequest[]))
    );
  }

  // Kérelem státuszának módosítása
  async updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
    const requestRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(requestRef, {
      status,
      updatedAt: new Date()
    });
  }

  // Dátumok konvertálása
  private convertDates(requests: VacationRequest[]): VacationRequest[] {
    return requests.map(request => ({
      ...request,
      startDate: request.startDate instanceof Date ? request.startDate : new Date(request.startDate),
      endDate: request.endDate instanceof Date ? request.endDate : new Date(request.endDate),
      createdAt: request.createdAt instanceof Date ? request.createdAt : new Date(request.createdAt),
      updatedAt: request.updatedAt instanceof Date ? request.updatedAt : new Date(request.updatedAt)
    }));
  }
}
