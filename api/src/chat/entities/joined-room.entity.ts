import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "./room.entity";

@Entity()
export class JoinedRoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, user => user.joinedRooms)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, room => room.joinedUsers)
  room: RoomEntity;
}