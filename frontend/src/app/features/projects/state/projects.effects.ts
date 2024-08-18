import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { ProjectsService } from "../services/projects.service"
import * as projectsActions from './projects.actions'
import { catchError, concatMap, exhaustMap, map, of, switchMap, tap } from "rxjs"
import { Project } from "../models/project.interface"
import { Router } from "@angular/router"
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface"
import { MatDialog } from "@angular/material/dialog"
import { UpdateProjectComponent } from "../components/update-project/update-project.component"
import { noOperation } from "../../../shared/state/shared.actions"
import { UpdateProjectDto } from "../models/update-project-dto.interface"
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service"


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
            switchMap(() =>
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
            switchMap(({filterProjectsRequest}) =>
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

export const loadProject$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.loadProject),
            switchMap(({ projectId }) =>
                projectsService.loadProject(projectId).pipe(
                    map((project: Project) => {
                        return projectsActions.loadProjectSuccess({project})
                    }),
                    catchError(() => {
                        return of(projectsActions.loadProjectFailure())
                        }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const openProjectDialog$ = createEffect(
    (action$ = inject(Actions), dialog = inject(MatDialog)) => {
        return action$.pipe(
            ofType(projectsActions.openProjectDialog),
            exhaustMap(({ dialogData }) => {
                const dialogRef = dialog.open(UpdateProjectComponent, { width: '800px', data: dialogData });
                return dialogRef.afterClosed().pipe(
                    concatMap((dialogResult: UpdateProjectDto) => {
                        if (dialogResult === undefined) 
                            return of(noOperation());
                        
                        return of(projectsActions.updateProject({updateProjectDto: dialogResult}));
                    })
                );
            }
            )
        )
    },
    {functional: true}
)

export const updateProject$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.updateProject),
            switchMap(({ updateProjectDto }) =>
                projectsService.updateProject(updateProjectDto).pipe(
                    map((project: Project) => {
                        return projectsActions.updateProjectSuccess({project})
                    }),
                    catchError(() => {
                        return of(projectsActions.updateProjectFailure())
                        }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const findCreatedProjectsForUser$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.findCreatedProjectsForUser),
            switchMap(({ username, status, paginationOptions }) =>
                projectsService.findCreatedProjectsForUser(username, status, paginationOptions).pipe(
                    map((paginatedProjects: PaginatedResponse<Project>) => {
                        return projectsActions.findCreatedProjectsForUserSuccess({paginatedProjects})
                    }),
                    catchError(() => {
                        return of(projectsActions.findCreatedProjectsForUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const findAppliedProjectsForUser$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.findAppliedProjectsForUser),
            switchMap(({ username, paginationOptions }) =>
                projectsService.findAppliedProjectsForUser(username, paginationOptions).pipe(
                    map((paginatedProjects: PaginatedResponse<Project>) => {
                        return projectsActions.findAppliedProjectsForUserSuccess({paginatedProjects})
                    }),
                    catchError(() => {
                        return of(projectsActions.findAppliedProjectsForUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const findAcceptedProjectsForUser$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.findAcceptedProjectsForUser),
            switchMap(({ username, isCompleted, paginationOptions }) =>
                projectsService.findAcceptedProjectsForUser(username, isCompleted, paginationOptions).pipe(
                    map((paginatedProjects: PaginatedResponse<Project>) => {
                        return projectsActions.findAcceptedProjectsForUserSuccess({paginatedProjects})
                    }),
                    catchError(() => {
                        return of(projectsActions.findAcceptedProjectsForUserFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
);

export const deleteProject$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.deleteProject),
            concatMap(({ projectId }) =>
                projectsService.delete(projectId).pipe(
                    map(() => {
                        return projectsActions.deleteProjectSuccess({ projectId })
                    }),
                    catchError(() => {
                        return of(projectsActions.deleteProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const redirectAfterDeleteSuccess$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(projectsActions.deleteProjectSuccess),
        tap(() => {
            router.navigateByUrl('/projects')
        })
    )
}, {
    functional:true,
    dispatch: false
})

export const changeProjectImage$ = createEffect(
    (action$ = inject(Actions), projectsService = inject(ProjectsService)) => {
        return action$.pipe(
            ofType(projectsActions.changeProjectImage),
            exhaustMap(({ projectId, image }) =>
                projectsService.changeProjectImage(projectId, image).pipe(
                    map((project: Project) => {
                        return projectsActions.changeProjectImageSuccess({ project })
                    }),
                    catchError(() => {
                        return of(projectsActions.changeProjectImageFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)