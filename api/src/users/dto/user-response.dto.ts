import { ReviewDto } from "src/reviews/dto/review.dto";
import { UserRoles } from "../enums/user-roles.enum";
import { TagDto } from "src/tags/dto/tag.dto";

export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: UserRoles;
    profileImage: string | null;
    createdAt: Date;
    tags: TagDto[]
    // writtenReviews: ReviewDto[];
    // receivedReviews: ReviewDto[];
}