import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { TagsService } from "../services/tags.service"
import * as tagsActions from '../state/tags.actions';
import { catchError, concatMap, exhaustMap, map, of, switchMap } from "rxjs";
import { Tag } from "../models/tag.interface";

export const searchTags$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.searchTags),
            switchMap(({tagName}) =>
                tagsService.searchTags(tagName).pipe(
                    map((tags: Tag[]) => {
                        return tagsActions.searchTagsSuccess({ tags })
                    }),
                    catchError(() => {
                        return of(tagsActions.searchTagsFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const addTagToUser$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.addTagToUser),
            concatMap(({ tagId }) =>
                tagsService.addTagToUser(tagId).pipe(
                    map((tag: Tag) => {
                        return tagsActions.addTagToUserSuccess({ tag })
                    }),
                    catchError(() => {
                        return of(tagsActions.addTagToUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const removeTagFromUser$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.removeTagFromUser),
            concatMap(({ tagId }) =>
                tagsService.removeTagFromUser(tagId).pipe(
                    map((tag: Tag) => {
                        return tagsActions.removeTagFromUserSuccess({ tag })
                    }),
                    catchError(() => {
                        return of(tagsActions.removeTagFromUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const addTagToProject$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.addTagToProject),
            concatMap(({ projectId, tagId }) =>
                tagsService.addTagToProject(projectId, tagId).pipe(
                    map((tag: Tag) => {
                        return tagsActions.addTagToProjectSuccess({ tag })
                    }),
                    catchError(() => {
                        return of(tagsActions.addTagToProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const removeTagFromProject$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.removeTagFromProject),
            concatMap(({ projectId, tagId }) =>
                tagsService.removeTagFromProject(projectId, tagId).pipe(
                    map((tag: Tag) => {
                        return tagsActions.removeTagFromProjectSuccess({ tag })
                    }),
                    catchError(() => {
                        return of(tagsActions.removeTagFromProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const createTag$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.createTag),
            exhaustMap(({tag}) =>
                tagsService.create(tag).pipe(
                    map((tag: Tag) => {
                        return tagsActions.createTagSuccess({ tag })
                    }),
                    catchError(() => {
                        return of(tagsActions.createTagFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const updateTag$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.updateTag),
            exhaustMap(({tag}) =>
                tagsService.updateTag(tag).pipe(
                    map((updatedTag: Tag) => {
                        return tagsActions.updateTagSuccess({ tag: updatedTag })
                    }),
                    catchError(() => {
                        return of(tagsActions.updateTagFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const deleteTag$ = createEffect(
    (action$ = inject(Actions), tagsService = inject(TagsService)) => {
        return action$.pipe(
            ofType(tagsActions.deleteTag),
            exhaustMap(({tagId}) =>
                tagsService.deleteTag(tagId).pipe(
                    map(() => {
                        return tagsActions.deleteTagSuccess({ tagId })
                    }),
                    catchError(() => {
                        return of(tagsActions.deleteTagFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)