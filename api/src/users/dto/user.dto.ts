
export interface UserDto {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRoles;
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user'
}