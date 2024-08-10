import { Tag } from "../../tags/models/tag.interface";

export interface CreateProjectDto {
    title: string;
    description: string;
    requirements: string | null;
    tags: Tag[];
}