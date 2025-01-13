import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Department } from "../../shared/models/Department";
import { map } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root', // Globálisan elérhető
})

export class DepartmentService {
    collectionNames = 'Department';


    constructor(private afs: AngularFirestore) { }

    create(department: Department) {
        return this.afs.collection<Department>(this.collectionNames).doc(department.id).set(department);
    }

    gatAllDepartments() {
        return this.afs.collection<Department>(this.collectionNames)
      .get()
      .pipe(
        map((querySnapshot) => {
          const departments: Department[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Department;
            departments.push(data);
          });

          return departments;
        })
      );
    }

    updateDepartment(departmentId: string, updatedData: Partial<Department>): Promise<void> {
        // Az AngularFirestore-on keresztül hivatkozunk a dokumentumára
        const departmentRef = this.afs.collection<Department>(this.collectionNames).doc(departmentId);

        // Frissítjük a dokumentumot az új adatokkal
        return departmentRef.update(updatedData);
    }

    deleteDepartment(departmentId: string): Promise<void> {
        // Az AngularFirestore-on keresztül hivatkozunk a dokumentumára
        const departmentRef = this.afs.collection<Department>(this.collectionNames).doc(departmentId);
    
        // Töröljük a dokumentumot
        return departmentRef.delete();
    }


}