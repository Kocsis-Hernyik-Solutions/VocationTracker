import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc, collectionData, getDoc, Timestamp, serverTimestamp } from '@angular/fire/firestore';
import { Observable, from, throwError, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { VacationRequest, VacationStatus } from '../shared/models/VacationRequest';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class VacationService {
  private readonly collectionName = 'vacationRequests';

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

  createRequest(request: Omit<VacationRequest, 'id'>): Observable<string> {
    const vacationCollection = collection(this.firestore, this.collectionName);
    const requestWithTimestamp = {
      ...request,
      startDate: Timestamp.fromDate(new Date(request.startDate)),
      endDate: Timestamp.fromDate(new Date(request.endDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      numberOfDays: this.calculateDays(request.startDate, request.endDate)
    };

    return from(addDoc(vacationCollection, requestWithTimestamp)).pipe(
      map(docRef => docRef.id),
      catchError(error => {
        console.error('Error creating vacation request:', error);
        return throwError(() => new Error('Failed to create vacation request'));
      })
    );
  }

  getUserRequests(userId: string): Observable<VacationRequest[]> {
    if (!userId) {
      console.warn('No user ID provided for getUserRequests');
      return of([]);
    }

    const vacationCollection = collection(this.firestore, this.collectionName);
    const q = query(vacationCollection, where('userId', '==', userId));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          console.log('No vacation requests found for user:', userId);
          return [];
        }
        return this.convertDates(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }),
      catchError(error => {
        console.error('Error fetching user requests:', error);
        return of([]);
      })
    );
  }

  getAllRequests(): Observable<VacationRequest[]> {
    const vacationCollection = collection(this.firestore, this.collectionName);
    
    return from(getDocs(vacationCollection)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          console.log('No vacation requests found in the database');
          return [];
        }
        return this.convertDates(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }),
      catchError(error => {
        console.error('Error fetching all requests:', error);
        return of([]);
      })
    );
  }

  updateRequestStatus(
    requestId: string, 
    status: VacationStatus, 
    updatedBy: string, 
    comments?: string
  ): Observable<void> {
    if (!requestId) {
      console.warn('No request ID provided for updateRequestStatus');
      return throwError(() => new Error('Request ID is required'));
    }

    const requestRef = doc(this.firestore, this.collectionName, requestId);
    
    // First check if the document exists and get its data
    return from(getDoc(requestRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          throw new Error('Vacation request not found');
        }
        return docSnap.data() as VacationRequest;
      }),
      switchMap(requestData => {
        const updateData: any = {
          status,
          updatedAt: serverTimestamp(),
          ...(status === 'approved' ? { approvedBy: updatedBy } : { rejectedBy: updatedBy })
        };

        if (comments !== undefined && comments !== null) {
          updateData.comments = comments;
        }

        const updatePromises = [updateDoc(requestRef, updateData)];

        // If the request is being approved, update the user's remaining days
        if (status === 'approved') {
          const daysToSubtract = requestData.numberOfDays || 
            this.calculateDays(requestData.startDate, requestData.endDate);
          
          updatePromises.push(this.userService.updateRemainingDays(requestData.userId, daysToSubtract));
        }

        return from(Promise.all(updatePromises));
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error updating request status:', error);
        return throwError(() => new Error('Failed to update request status'));
      })
    );
  }

  private convertDates(requests: any[]): VacationRequest[] {
    if (!Array.isArray(requests)) {
      console.warn('Invalid data format received for date conversion');
      return [];
    }

    return requests.map(request => {
      try {
        const converted: VacationRequest = {
          ...request,
          startDate: this.convertToDate(request.startDate),
          endDate: this.convertToDate(request.endDate),
          createdAt: this.convertToDate(request.createdAt),
          numberOfDays: request.numberOfDays || this.calculateDays(
            this.convertToDate(request.startDate),
            this.convertToDate(request.endDate)
          )
        };

        if (request.updatedAt) {
          converted.updatedAt = this.convertToDate(request.updatedAt);
        }

        return converted;
      } catch (error) {
        console.error('Error converting request dates:', error);
        return null;
      }
    }).filter(request => request !== null) as VacationRequest[];
  }

  private convertToDate(timestamp: any): Date {
    if (!timestamp) {
      return new Date();
    }

    try {
      if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
      }

      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
      }

      if (timestamp instanceof Date) {
        return timestamp;
      }

      return new Date(timestamp);
    } catch (error) {
      console.error('Error converting timestamp to date:', error);
      return new Date();
    }
  }

  private calculateDays(startDate: Date, endDate: Date): number {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    } catch (error) {
      console.error('Error calculating days:', error);
      return 0;
    }
  }

  getRequestById(requestId: string): Observable<VacationRequest | undefined> {
    if (!requestId) {
      console.warn('No request ID provided for getRequestById');
      return of(undefined);
    }

    const requestRef = doc(this.firestore, this.collectionName, requestId);
    return from(getDoc(requestRef)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          console.log('No vacation request found with ID:', requestId);
          return undefined;
        }
        return this.convertDates([{ ...docSnap.data(), id: docSnap.id }])[0];
      }),
      catchError(error => {
        console.error('Error fetching request:', error);
        return of(undefined);
      })
    );
  }
}
