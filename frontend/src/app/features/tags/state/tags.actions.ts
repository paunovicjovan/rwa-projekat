import { createAction, props } from "@ngrx/store";
import { Tag } from "../models/tag.interface";

export const searchTags = createAction(
    '[Tags] Search Tags',
    props<{tagName: string}>()
);

export const searchTagsSuccess = createAction(
    '[Tags] Search Tags Success',
    props<{tags: Tag[]}>()
);

export const searchTagsFailure = createAction(
    '[Tags] Search Tags Failure',
);