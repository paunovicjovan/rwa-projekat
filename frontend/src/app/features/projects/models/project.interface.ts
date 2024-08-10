import { Tag } from "../../tags/models/tag.interface";
import { User } from "../../users/models/user.interface";
import { ProjectStatus } from "../enums/project-status.enum";

export interface Project {
    id: number;
    title: string;
    image: string | null;
    description: string;
    requirements: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatus;
    applicationLink: string | null;
    repositoryLink: string | null;
    tags: Tag[]
    createdBy: User
    appliedBy: User[]
    acceptedUsers: User[]
}
