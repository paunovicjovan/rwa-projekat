import { Review } from "../../reviews/models/review.interface";
import { Tag } from "../../tags/models/tag.interface";
import { UserRoles } from "./user-roles.enum";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    createdAt: Date;
    profileImage: string | null;
    // reviews: Review[]
    tags: Tag[]
}