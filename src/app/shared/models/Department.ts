import { User } from "./User";

export interface Department {
    id: string;
    name: string;
    members: number;
    leaders: User[];
}