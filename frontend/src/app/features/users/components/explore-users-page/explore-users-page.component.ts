import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../tags/models/tag.interface';

@Component({
  selector: 'app-explore-users-page',
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss'
})
export class ExploreUsersPageComponent implements OnInit {

  tagsForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeTagsForm();
  }

  initializeTagsForm() {
    this.tagsForm = this.formBuilder.group({
      tags: this.formBuilder.array([], [Validators.required])
    });
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

  searchByTags() {
    const tagsIds = this.formTags.value.map((tag: Tag) => tag.id);
    console.log(tagsIds);
  }

  get formTags() {
    return this.tagsForm.get('tags') as FormArray;
  }
}
