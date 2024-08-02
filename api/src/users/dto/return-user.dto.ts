import { ReviewDto } from "src/reviews/dto/review.dto";
import { UserRoles } from "../enums/user-roles.enum";

export class ReturnUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
    dateCreated: Date;
    writtenReviews: ReviewDto[];
    receivedReviews: ReviewDto[];
}