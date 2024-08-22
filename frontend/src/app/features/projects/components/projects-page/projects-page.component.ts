import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import { Tag } from '../../../tags/models/tag.interface';
import { combineLatest, Observable } from 'rxjs';
import * as projectsSelectors from '../../state/projects.selectors';
import * as projectsActions from '../../state/projects.actions';
import { FilterProjectsRequest } from '../../models/filter-projects-request.interface';
import { PaginationParameters } from '../../../../shared/models/pagination-parameters.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent implements OnInit {

  filtersForm!: FormGroup;
  hasSearched: boolean = false;
  pageEvent!: PageEvent;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeFiltersForm();
    this.initializePaginator();
    this.store.dispatch(projectsActions.loadSuggestedProjects());
  }

  initializeFiltersForm() {
    this.filtersForm = this.formBuilder.group({
      title: [null],
      minDate: [null],
      tags: this.formBuilder.array([])
    });
  }

  initializePaginator() {
    this.pageEvent = {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    }
  }

  onPaginateChange(pageEvent: PageEvent) {
    this.pageEvent = pageEvent;
    this.filterProjects(); 
  }

  filterProjects() {
    const tagsIds = this.formTags.value.map((tag: Tag) => tag.id);
    const filters: FilterProjectsRequest = {
      page: this.pageEvent.pageIndex + 1,
      limit: this.pageEvent.pageSize,
      title: this.title.value,
      minDate: this.minDate.value,
      tagsIds: tagsIds
    }
    this.store.dispatch(projectsActions.filterProjects({filterProjectsRequest: filters}));
    this.hasSearched = true;
  }

  addTagToForm(tag: Tag) {
    if(this.findTagIndexInForm(tag.id) >= 0)
      return;

    const newTagFormControl = new FormControl({...tag});
    this.formTags.push(newTagFormControl);
  }

  removeTagFromForm(tagId: number) {
    const tagIndex = this.findTagIndexInForm(tagId);
    this.formTags.removeAt(tagIndex);
  }

  findTagIndexInForm(tagId: number): number {
    const tagIndex = this.formTags.value.findIndex((tag: Tag) => tag.id === tagId);
    return tagIndex;
  }

  clearChosenDate() {
    this.minDate.setValue(null);
  }

  get title() {
    return this.filtersForm.get('title') as FormControl;
  }

  get minDate() {
    return this.filtersForm.get('minDate') as FormControl;
  }

  get formTags() {
    return this.filtersForm.get('tags') as FormArray;
  }

}
