
export class CreateProjectDto {
    title: string;
    image: File | null;
    description: string;
    requirements: string | null;
    dueDate: Date | null;
}
