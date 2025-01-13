export interface Department {
    id: string;
    name: string;
    members: number;
    leaders: {
        leaderId: string;
    }
}