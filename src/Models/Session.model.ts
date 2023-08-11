import { Attendee } from "./Attendee.model";

export interface Session {
    id:number;
    title: string;
    start: Date;
    end: Date;
    attendee_list: Attendee[];
    is_registered: boolean;
}