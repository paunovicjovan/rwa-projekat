import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../enums/user-roles.enum";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { TagEntity } from "src/tags/entities/tag.entity";
import { ProjectEntity } from "src/projects/entities/project.entity";
import { ConnectedUserEntity } from "src/chat/entities/connected-user.entity";
import { RoomEntity } from "src/chat/entities/room.entity";
import { JoinedRoomEntity } from "src/chat/entities/joined-room.entity";
import { MessageEntity } from "src/chat/entities/message.entity";


@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    username: string;

    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;

    @Column({type:'enum', enum: UserRoles, default:UserRoles.USER})
    role: UserRoles;

    @Column({default: null, nullable: true})
    profileImage: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ReviewEntity, review => review.author)
    writtenReviews: ReviewEntity[];

    @OneToMany(() => ReviewEntity, review => review.reviewee)
    receivedReviews: ReviewEntity[];

    @ManyToMany(() => TagEntity, tag => tag.users)
    tags: TagEntity[]

    @OneToMany(() => ProjectEntity, project => project.createdBy)
    createdProjects: ProjectEntity[]

    @ManyToMany(() => ProjectEntity, project => project.appliedBy)
    @JoinTable()
    appliedTo: ProjectEntity[]

    @ManyToMany(() => ProjectEntity, project => project.acceptedUsers)
    @JoinTable()
    acceptedIn: ProjectEntity[]

    @OneToMany(() => ConnectedUserEntity, connectedUser => connectedUser.user)
    connections: ConnectedUserEntity[]

    @ManyToMany(() => RoomEntity, room => room.users)
    rooms: RoomEntity[]

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.user)
    joinedRooms: JoinedRoomEntity[]

    @OneToMany(() => MessageEntity, message => message.user)
    messages: MessageEntity[]
}