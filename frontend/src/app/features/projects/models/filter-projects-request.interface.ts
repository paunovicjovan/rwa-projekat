
export interface FilterProjectsRequest {
    page: number;
    limit: number;
    title: string;
    minDate: Date;
    tagsIds: number[]
}