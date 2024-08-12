import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { ProjectsService } from "../services/projects.service"
import * as projectsActions from './projects.actions'
import { catchError, concatMap, map, of, tap } from "rxjs"
import { Project } from "../models/project.interface"
import { Router } from "@angular/router"
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface"


export const createProject$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.createProject),
            concatMap(({image, createProjectDto}) =>
                projectsService.create(createProjectDto, image).pipe(
                    map((project: Project) => {
                        return projectsActions.createProjectSuccess()
                    }),
                    catchError(() => {
                        return of(projectsActions.createProjectFailure())
                        }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const redirectAfterProjectCreation$ = createEffect(
    (actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(projectsActions.createProjectSuccess),
        tap(() => {
            router.navigateByUrl('/projects');
        })
    )
}, {
    functional:true,
    dispatch: false
});

export const loadSuggestedProjects$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.loadSuggestedProjects),
            concatMap(() =>
                projectsService.loadSuggestedProjects().pipe(
                    map((projects: Project[]) => {
                        return projectsActions.loadSuggestedProjectsSuccess({projects})
                    }),
                    catchError(() => {
                        return of(projectsActions.loadSuggestedProjectsFailure())
                        }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const filterProjects$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.filterProjects),
            concatMap(({filterProjectsRequest}) =>
                projectsService.filterProjects(filterProjectsRequest).pipe(
                    map((response: PaginatedResponse<Project>) => {
                        return projectsActions.filterProjectsSuccess({projects: response.items, paginationMetadata: response.meta})
                    }),
                    catchError(() => {
                        return of(projectsActions.filterProjectsFailure())
                        }
                    )
                )
            )
        )
    },
    {functional: true}
);