import { UserResponseDto } from "src/users/dto/user/user-response.dto";

export class ReviewResponseDto {
    id: number;
    rating: number;
    content: string;
    createdAt: Date;
    author: UserResponseDto;
    reviewee: UserResponseDto;
}