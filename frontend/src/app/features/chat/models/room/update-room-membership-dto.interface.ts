import { User } from "../../../users/models/user.interface";

export interface UpdateRoomMembershipDto {
    user: User;
    roomId: number;
}