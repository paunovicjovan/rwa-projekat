import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { combineLatest, Observable } from 'rxjs';
import * as tagsSelectors from '../../state/tags.selectors';
import * as tagsActions from '../../state/tags.actions';
import { Tag } from '../../models/tag.interface';
import * as sharedActions from '../../../../shared/state/shared.actions';

@Component({
  selector: 'app-manage-tags-page',
  templateUrl: './manage-tags-page.component.html',
  styleUrl: './manage-tags-page.component.scss'
})
export class ManageTagsPageComponent implements OnInit {

  tagForm!: FormGroup;
  isEditingTag: boolean = false;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.selectDataFromStore();
  }

  initializeForm() {
    this.tagForm = this.formBuilder.group({
      id: [null],
      name: [null, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      description: [null, [
        Validators.maxLength(100)
      ]]
    }) 
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(tagsSelectors.selectIsLoading),
      tags: this.store.select(tagsSelectors.selectLoadedTags)
    })
  }

  submitForm() {
    if(!this.isEditingTag) {
      this.store.dispatch(tagsActions.createTag({tag: this.tagForm.getRawValue()}));
    }
    else {
      this.store.dispatch(tagsActions.updateTag({tag: this.tagForm.getRawValue()}));
    }

    this.resetForm();
  }

  switchToEditMode(tag: Tag) {
    this.isEditingTag = true;
    this.tagForm.patchValue(tag);
  }

  leaveEditMode() {
    this.resetForm();
  }

  resetForm() {
    this.isEditingTag = false;
    this.tagForm.reset();
  }
  
  showTag(tag: Tag) {
    this.store.dispatch(tagsActions.addTagToState({tag}));
  }

  deleteTag(tagId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj tag?",
      actionToDispatch: tagsActions.deleteTag({ tagId })
    }));
  }
}
