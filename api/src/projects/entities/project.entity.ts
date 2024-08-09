import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProjectStatus } from "../enums/project-status.enum";
import { TagEntity } from "src/tags/entities/tag.entity";
import { UserEntity } from "src/users/entities/user.entity";


@Entity()
export class ProjectEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true, default: null})
    image: string;

    @Column()
    description: string;

    @Column({nullable: true, default: null})
    requirements: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable: true, default: null})
    dueDate: Date;

    @Column({type:'enum', enum: ProjectStatus, default:ProjectStatus.OPENED})
    status: ProjectStatus;

    @Column({nullable: true, default: null})
    applicationLink: string;
    
    @Column({nullable: true, default: null})
    repositoryLink: string;

    @ManyToMany(() => TagEntity, tag => tag.projects)
    @JoinTable({name: 'projects_tags'})
    tags: TagEntity[]

    @ManyToOne(() => UserEntity, user => user.createdProjects)
    createdBy: UserEntity

    @ManyToMany(() => UserEntity, user => user.appliedTo)
    @JoinTable({name: 'users_applied_projects'})
    appliedBy: UserEntity[]

    @ManyToMany(() => UserEntity, user => user.acceptedIn)
    @JoinTable({name: 'users_accepted_projects'})
    acceptedUsers: UserEntity[]
}
