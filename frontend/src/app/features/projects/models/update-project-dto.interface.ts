
export interface UpdateProjectDto {
    id: number;
    title: string;
    description: string;
    requirements: string | null;
}