export interface User{
    id: string;
    email: string;
    name: string;
    vocation: number;
    leader: boolean;
    department: {
        id: string,
        name: string
    };
}