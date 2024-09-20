import { ReviewDto } from "src/reviews/dto/review.dto";
import { UserRoles } from "../../enums/user-roles.enum";
import { TagDto } from "src/tags/dto/tag.dto";
import { ProjectDto } from "src/projects/dto/project.dto";
import { ConnectedUserDto } from "src/chat/dto/connected-user/connected-user.dto";
import { RoomDto } from "src/chat/dto/room/room.dto";
import { JoinedRoomDto } from "src/chat/dto/joined-room/joined-room.dto";
import { MessageDto } from "src/chat/dto/message/message.dto";
import { PersonalityScoreDto } from "../personality-score/personality-score.dto";

export class UserDto {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: UserRoles;
    profileImage: string | null;
    createdAt: Date;
    writtenReviews: ReviewDto[];
    receivedReviews: ReviewDto[];
    tags: TagDto[];
    createdProjects: ProjectDto[];
    appliedTo: ProjectDto[];
    acceptedIn: ProjectDto[];
    connections: ConnectedUserDto[]
    rooms: RoomDto[]
    createdRooms: RoomDto[]
    joinedRooms: JoinedRoomDto[]
    messages: MessageDto[]
    personalityScore: PersonalityScoreDto
}