export interface LoginFormResponse {
    key: string,
    user: {
        email: string,
        first_name: string,
        id: number,
        is_active: boolean,
        is_staff: boolean,
        is_superuser: boolean,
        last_name: string,
        pt_coach: {
            key: number,
            value: number,
        }[],
        username: string,
    }
}