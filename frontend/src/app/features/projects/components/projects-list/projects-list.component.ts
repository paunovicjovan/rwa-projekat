import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../models/project.interface';
import { combineLatest, Observable } from 'rxjs';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as projectsSelectors from '../../state/projects.selectors';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {

  @Input() isSuggestedMode: boolean = false;
  @Output() onPaginateChange: EventEmitter<PageEvent> = new EventEmitter();
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(projectsSelectors.selectIsLoading),
      projects: this.store.select(projectsSelectors.selectProjects),
      paginationMetadata: this.store.select(projectsSelectors.selectPaginationMetadata)
    })
  }

  handlePaginateChange(pageEvent: PageEvent) {
    this.onPaginateChange.emit(pageEvent);
  }
}
