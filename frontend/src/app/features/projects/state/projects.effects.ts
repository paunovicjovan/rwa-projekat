import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { ProjectsService } from "../services/projects.service"
import * as projectsActions from './projects.actions'
import { catchError, concatMap, map, of, tap } from "rxjs"
import { Project } from "../models/project.interface"
import { Router } from "@angular/router"


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
)

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
})