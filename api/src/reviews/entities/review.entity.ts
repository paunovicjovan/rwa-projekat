import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column()
    content: string;

    @Column({type:"date", default: () => 'CURRENT_DATE'})
    createdAt: Date;

    @ManyToOne(type => UserEntity, user => user.writtenReviews)
    author: UserEntity;

    @ManyToOne(type => UserEntity, user => user.receivedReviews)
    reviewee: UserEntity;
}
