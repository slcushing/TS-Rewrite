export interface Client {
    id: number;
    avatar?: string;
    first_name: string;
    last_name: string;
    phone_number: number;
    email: string;
    coach_notes: string;
    member_notes: string;
    coach_name: string; //string or number? backend it's got a foreign key relationship
    is_client?:boolean;
}