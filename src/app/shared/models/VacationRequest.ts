export type VacationType = 'annual' | 'sick' | 'unpaid' | 'special';
export type VacationStatus = 'pending' | 'approved' | 'rejected';

export interface VacationRequest {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: VacationType;
  reason?: string;
  status: VacationStatus;
  numberOfDays: number;
  createdAt: Date;
  updatedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
  comments?: string;
}
