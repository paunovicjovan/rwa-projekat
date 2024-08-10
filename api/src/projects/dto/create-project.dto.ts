import { TagDto } from "src/tags/dto/tag.dto";

export class CreateProjectDto {
    title: string;
    description: string;
    requirements: string | null;
    tags: TagDto[];
}
