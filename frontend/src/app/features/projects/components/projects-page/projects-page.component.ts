import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import { Tag } from '../../../tags/models/tag.interface';
import { combineLatest, Observable } from 'rxjs';
import * as projectsSelectors from '../../state/projects.selectors';
import * as projectsActions from '../../state/projects.actions';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent implements OnInit {

  filtersForm!: FormGroup;
  dataFromStore$!: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeFiltersForm();
    this.selectDataFromStore();
    this.store.dispatch(projectsActions.loadSuggestedProjects());
  }

  initializeFiltersForm() {
    this.filtersForm = this.formBuilder.group({
      title: [null],
      minDate: [null],
      tags: this.formBuilder.array([])
    });
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(projectsSelectors.selectIsLoading),
      projects: this.store.select(projectsSelectors.selectProjects),
      paginationMetadata: this.store.select(projectsSelectors.selectPaginationMetadata)
    })
  }

  filterProjects() {
    console.log(this.filtersForm.getRawValue());
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

  get formTags() {
    return this.filtersForm.get('tags') as FormArray;
  }

}
