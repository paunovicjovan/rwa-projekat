import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRoles } from "../enums/user-roles.enum";
import { ReviewEntity } from "src/reviews/entities/review.entity";


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
    createdAt: Date;

    @OneToMany(type => ReviewEntity, review => review.author)
    writtenReviews: ReviewEntity[];

    @OneToMany(type => ReviewEntity, review => review.reviewee)
    receivedReviews: ReviewEntity[];
}