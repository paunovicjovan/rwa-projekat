import { EntityState } from "@ngrx/entity";
import { Room } from "./room.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";

export interface ChatState extends EntityState<Room> {
    paginationMetadata: PaginationMetadata;
}