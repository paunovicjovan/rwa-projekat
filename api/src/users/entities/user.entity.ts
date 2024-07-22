import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../enums/user-roles.enum";


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

    @Column({type:"date", default: () => 'CURRENT_DATE'})
    dateCreated: Date;
}