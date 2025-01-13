import { Component, OnInit } from '@angular/core';
import { VacationRequest } from '../../models/vacation-request.model';
import { VacationService } from '../../services/vacation.service';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent implements OnInit {
  allRequests: VacationRequest[] = [];
  loading = false;
  error: string | null = null;

  constructor(private vacationService: VacationService) {}

  ngOnInit(): void {
    this.loadAllRequests();
  }

  private loadAllRequests(): void {
    this.loading = true;
    this.error = null;

    this.vacationService.getAllRequests().subscribe({
      next: (requests) => {
        this.allRequests = requests;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.error = 'Failed to load vacation requests. Please try again later.';
        this.loading = false;
      }
    });
  }
}
