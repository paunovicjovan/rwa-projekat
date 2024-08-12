import { UserResponseDto } from "src/users/dto/user-response.dto";

export class ReviewDto {
    id: number;
    rating: number;
    content: string;
    createdAt: Date;
    author: UserResponseDto;
    reviewee: UserResponseDto;
}