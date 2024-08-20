import { UserDto } from "src/users/dto/user.dto";

export class RoomDto {
  id: number;
  name: string;
  description: string;
  users: UserDto[];
  createdAt: Date;
}