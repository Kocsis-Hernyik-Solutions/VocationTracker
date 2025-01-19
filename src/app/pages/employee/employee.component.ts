import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { Department } from '../../shared/models/Department';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentService } from '../../services/firestore/department.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { EmailService } from '../../services/email.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  basicInfoForm!: FormGroup;
  roleForm!: FormGroup;
  departmentForm!: FormGroup;
  leaveForm!: FormGroup;
  departments: Department[] = [];

  constructor(private _formBuilder: FormBuilder, private departmentService: DepartmentService, private userService: UserService, private authService: AuthService, private emailService: EmailService) { }

  ngOnInit(): void {
    this.basicInfoForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
    });

    this.roleForm = this._formBuilder.group({
      post: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.departmentForm = this._formBuilder.group({
      department: [[], Validators.required],
    });

    this.leaveForm = this._formBuilder.group({
      remainingDays: [0, [Validators.required, Validators.min(0)]],
    });

    this.departmentService.getAllDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  async submitForm() {
    const userData: User = {
      id: '', // Ezt később a Firebase-ből állítjuk be
      email: this.basicInfoForm.get('email')?.value,
      name: this.basicInfoForm.get('name')?.value,
      phoneNumber: this.basicInfoForm.get('phoneNumber')?.value || null,
      post: this.roleForm.get('post')?.value,
      role: this.roleForm.get('role')?.value,
      department: this.departmentForm.get('department')?.value,
      remainingDays: this.leaveForm.get('remainingDays')?.value,
      taken_days: 0, // Kezdésként 0, mert még nem vett ki szabadságot
      isActive: true, // Alapértelmezett érték
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create the user in Firebase Auth
    const password = this.generatePassword(8); // 8 karakter hosszú jelszó
    const firebaseUser = await this.authService.signupUser(userData.email, password);
    userData.id = firebaseUser.uid;

    this.userService.createUser(firebaseUser.uid, userData).then(() => {
      console.log('User Data:', userData);
      alert('User data submitted successfully!');
      this.tabGroup.selectedIndex = 0;
    });
    
    this.emailService.sendMailToRegistration(userData.name,password,"KHS",userData.email);

  }

  generatePassword(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);

    crypto.getRandomValues(randomValues);

    return Array.from(randomValues, (value) => charset[value % charset.length]).join('');
  }


}
