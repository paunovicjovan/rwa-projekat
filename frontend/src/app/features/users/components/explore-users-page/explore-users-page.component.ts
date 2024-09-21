import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../tags/models/tag.interface';
import { ExploreUsersMode } from '../../models/explore-users-mode.enum';
import { PageEvent } from '@angular/material/paginator';
import * as usersActions from '../../state/users.actions';
import { PaginationOptions } from '../../../../shared/models/pagination-options.interface';

@Component({
  selector: 'app-explore-users-page',
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss'
})
export class ExploreUsersPageComponent implements OnInit {

  tagsForm!: FormGroup;
  exploreMode: ExploreUsersMode = ExploreUsersMode.Suggested;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeTagsForm();
    this.searchUsers();
  }

  initializeTagsForm() {
    this.tagsForm = this.formBuilder.group({
      tags: this.formBuilder.array([], [Validators.required])
    });
  }

  onTabChange(index: number) {
    this.exploreMode = index;
    this.searchUsers();
  }

  searchUsers() {
    if(this.exploreMode == ExploreUsersMode.Suggested) {
      this.store.dispatch(usersActions.searchSuggestedUsers());
    }
    else if(this.exploreMode == ExploreUsersMode.SearchByTags) {
      this.searchByTags(1, 10);
    }
  }

  onPaginateChange(event: PageEvent) {
    this.searchByTags(event.pageIndex + 1, event.pageSize);
  }

  searchByTags(page: number, limit: number) {
    const tagsIds = this.formTags.value.map((tag: Tag) => tag.id);
    const paginationOptions: PaginationOptions = {
      page,
      limit
    }
    this.store.dispatch(usersActions.searchUsersByTags({paginationOptions, tagsIds}))
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
    return this.tagsForm.get('tags') as FormArray;
  }
}
