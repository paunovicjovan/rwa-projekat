import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { TagsService } from "../services/tags.service"
import * as tagsActions from '../state/tags.actions';
import { catchError, map, of, switchMap } from "rxjs";
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
