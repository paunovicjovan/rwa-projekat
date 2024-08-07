import { User } from "../../users/models/user.interface";

export interface Review {
    id: number;
    rating: number;
    content: string;
    createdAt: Date;
    author: User;
    reviewee: User;
}