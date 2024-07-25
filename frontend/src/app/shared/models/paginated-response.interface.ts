import { PaginationMetadata } from "./pagination-metadata.interface";

export interface PaginatedResponse<T> {
    items: T[],
    meta: PaginationMetadata
}