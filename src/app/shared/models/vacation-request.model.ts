export interface VacationRequest {
    id: string;
    startDate: Date;
    endDate: Date;
    duration: number;
    type: VacationType;
    status: RequestStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    comment?: string;
}

export enum VacationType {
    ANNUAL = 'ANNUAL',
    SICK = 'SICK',
    UNPAID = 'UNPAID',
    SPECIAL = 'SPECIAL'
}

export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}
