import { User } from "../../users/models/user.interface";

export interface Room {
    id: number;
    name: string;
    description: string | null;
    users: User[]
    createdAt: Date;
}