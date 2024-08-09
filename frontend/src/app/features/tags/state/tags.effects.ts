import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { TagsService } from "../services/tags.service"
import * as tagsActions from '../state/tags.actions';
import { catchError, concatMap, map, of, switchMap } from "rxjs";
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