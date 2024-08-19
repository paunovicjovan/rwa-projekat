import { createAction, props } from "@ngrx/store";
import { Tag } from "../models/tag.interface";
import { CreateTagDto } from "../models/create-tag-dto.interface";
import { UpdateTagDto } from "../models/update-tag-dto.interface";

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

// export const loadTagsSuccess = createAction(
//     '[Tags] Load Tags Success',
//     props<{tags: Tag[]}>()
// );

// export const loadTagsFailure = createAction(
//     '[Tags] Load Tags Failure'
// );

export const addTagToUser = createAction(
    '[Tags] Add Tag To User',
    props<{ tagId: number }>()
);

export const addTagToUserSuccess = createAction(
    '[Tags] Add Tag To User Success',
    props<{ tag: Tag }>()
);

export const addTagToUserFailure = createAction(
    '[Tags] Add Tag To User Failure',
);

export const removeTagFromUser = createAction(
    '[Tags] Remove Tag From User',
    props<{ tagId: number }>()
);

export const removeTagFromUserSuccess = createAction(
    '[Tags] Remove Tag From User Success',
    props<{ tag: Tag }>()
);

export const removeTagFromUserFailure = createAction(
    '[Tags] Remove Tag From User Failure',
);

export const addTagToProject = createAction(
    '[Tags] Add Tag To Project',
    props<{ projectId:number, tagId: number }>()
);

export const addTagToProjectSuccess = createAction(
    '[Tags] Add Tag To Project Success',
    props<{ tag: Tag }>()
);

export const addTagToProjectFailure = createAction(
    '[Tags] Add Tag To Project Failure',
);

export const removeTagFromProject = createAction(
    '[Tags] Remove Tag From Project',
    props<{ projectId: number, tagId: number }>()
);

export const removeTagFromProjectSuccess = createAction(
    '[Tags] Remove Tag From Project Success',
    props<{ tag: Tag }>()
);

export const removeTagFromProjectFailure = createAction(
    '[Tags] Remove Tag From Project Failure',
);

export const createTag = createAction(
    '[Tags] Create Tag',
    props<{ tag: CreateTagDto }>()
);

export const createTagSuccess = createAction(
    '[Tags] Create Tag Success',
    props<{ tag: Tag }>()
);

export const createTagFailure = createAction(
    '[Tags] Create Tag Failure',
);

export const addTagToState = createAction(
    '[Tags] Add Tag To State',
    props<{ tag: Tag }>()
);

export const updateTag = createAction(
    '[Tags] Update Tag',
    props<{ tag: UpdateTagDto }>()
);

export const updateTagSuccess = createAction(
    '[Tags] Update Tag Success',
    props<{ tag: Tag }>()
);

export const updateTagFailure = createAction(
    '[Tags] Update Tag Failure',
);

export const deleteTag = createAction(
    '[Tags] Delete Tag',
    props<{ tagId: number }>()
);

export const deleteTagSuccess = createAction(
    '[Tags] Delete Tag Success',
    props<{ tagId: number }>()
);

export const deleteTagFailure = createAction(
    '[Tags] Delete Tag Failure',
);