
export interface UserDto {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    profileImage?: string;
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user'
}