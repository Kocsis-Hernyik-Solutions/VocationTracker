export interface User {
    id: string;
    email: string;
    name: string;
    avaiable_days_off: number;
    taken_days: number;
    leader: boolean;
    admin: boolean;
     department: {
     id: string;
     name: string;
 };
    post: string;

}