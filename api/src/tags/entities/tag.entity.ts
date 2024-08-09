import { ProjectEntity } from "src/projects/entities/project.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({nullable: true, default: null})
    description: string;

    @ManyToMany(() => UserEntity, user => user.tags)
    @JoinTable()
    users: UserEntity[]

    @ManyToMany(() => ProjectEntity, project => project.tags)
    @JoinTable()
    projects: ProjectEntity[]
}
