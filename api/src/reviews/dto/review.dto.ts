import { UserDto } from "src/users/dto/user.dto";

export class ReviewDto {
    id: number;
    rating: number;
    content: string;
    createdAt: Date;
    author: UserDto;
    reviewee: UserDto;
}