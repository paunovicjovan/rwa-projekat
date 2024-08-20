import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedRoomEntity } from "./joined-room.entity";
import { MessageEntity } from "./message.entity";

@Entity()
export class RoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @ManyToMany(() => UserEntity, user => user.rooms)
  @JoinTable()
  users: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => JoinedRoomEntity, joinedUser => joinedUser.room)
  joinedUsers: JoinedRoomEntity[]

  @OneToMany(() => MessageEntity, message => message.room)
  messages: MessageEntity[]
}