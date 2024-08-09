import { EntityState } from "@ngrx/entity";
import { Tag } from "./tag.interface";

export interface TagsState extends EntityState<Tag> {
    isLoading: boolean;
    filteredTags: Tag[]
}