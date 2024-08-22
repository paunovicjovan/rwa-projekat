import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../../tags/models/tag.interface';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as projectsActions from '../../state/projects.actions';
import { CreateProjectDto } from '../../models/create-project-dto.interface';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent implements OnInit {

  projectForm!: FormGroup;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null | undefined = null;
  croppedImageUrl: string = '';
  @ViewChild("imageUploadControl", {static:false}) imageUploadControl!:ElementRef;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      title: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      description: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]],
      requirements: [null, [
        Validators.maxLength(500)
      ]],
      tags: this.formBuilder.array([], [
        Validators.required
      ])
    });  
  }

  createProject() {
    let croppedImageFile = undefined;
    if(this.croppedImage)
       croppedImageFile = new File([this.croppedImage], 'project-image.png', { type: 'image/png' });

    const createProjectDto: CreateProjectDto = this.projectForm.getRawValue();
    this.store.dispatch(projectsActions.createProject({image: croppedImageFile, createProjectDto }));
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
    return this.projectForm.get('tags') as FormArray;
  }

  selectedImageChanged(event: Event) {
    this.imageChangedEvent = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
    this.croppedImageUrl = URL.createObjectURL(event.blob!);
  }
}
