import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../dto/user.dto";


@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    username: string;

    @Column({unique:true})
    email: string;


    @Column({select:false})
    password: string;

    @Column({type:'enum', enum: UserRoles, default:UserRoles.USER})
    role: UserRoles;
}