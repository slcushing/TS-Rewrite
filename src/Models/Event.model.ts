export interface Event {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    gymEvent: boolean;
    details: string;
}