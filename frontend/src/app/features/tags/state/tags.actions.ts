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