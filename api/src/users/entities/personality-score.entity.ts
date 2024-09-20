import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";


@Entity()
export class PersonalityScoreEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    adaptability: number;

    @Column()
    extroversion: number;

    @Column()
    independence: number;

    @Column()
    workMotivation: number;

    @Column()
    deadlineCommitment: number;

    @Column()
    detailCommitment: number;

    @Column()
    preferredTeamSize: number;

    @Column()
    liveCommunication: number;

    @Column()
    innovativeness: number;

    @OneToOne(() => UserEntity, user => user.personalityScore)
    @JoinColumn()
    user: UserEntity;    
}