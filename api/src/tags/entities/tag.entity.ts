import { ProjectEntity } from "src/projects/entities/project.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true, default: null})
    description: string;

    @ManyToMany(() => UserEntity, user => user.tags)
    users: UserEntity[]

    @ManyToMany(() => ProjectEntity, project => project.tags)
    projects: ProjectEntity[]
}
