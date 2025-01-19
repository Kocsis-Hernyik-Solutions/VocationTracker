import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DepartmentService } from '../../services/firestore/department.service';
import { Department } from '../../shared/models/Department';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
})
export class DepartmentComponent implements OnInit {
  deleteDepartment(department: Department) {
    if (department.members === 0) {
      this.departmentService.deleteDepartment(department.id);
      // Távolítsuk el az elemet a tömbből
      this.departments = this.departments.filter(d => d.id !== department.id);

      // Frissítsük a táblázat adatforrását
      this.dataSource.data = this.departments;
    } else {
      console.log("amég van meber nem lehet törölni");
    }
  }
  exampleForm: FormGroup;
  departments: Department[] = [];
  dataSource = new MatTableDataSource<Department>([]); // Üres kezdeti adatforrás
  displayedColumns: string[] = ['name', 'members', 'leaders', 'delete'];

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.exampleForm = this.fb.group({
      //Validators.required, Validators.minLength(3) kivettem mert zavart xd
      data: ['', []],
    });
  }

  ngOnInit(): void {
    this.departmentService.getAllDepartments().subscribe((departments) => {
      this.departments = departments;
      this.dataSource.data = this.departments; // Frissítjük a táblázat adatforrását
    });
  }

  onSubmit() {
    const department: Department = {
      id: crypto.randomUUID(),
      name: this.exampleForm.get('data')?.value,
      members: 0,
      leaders: []
    };
    this.departmentService.create(department);
    this.exampleForm.get('data')?.setValue('');
    // Hozzáadjuk az új elemet a tömbhöz
    this.departments.push(department);

    // Frissítjük a MatTableDataSource-t
    this.dataSource.data = this.departments;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
