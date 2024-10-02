import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as projectsActions from '../../state/projects.actions';
import * as projectsSelectors from '../../state/projects.selectors';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-image-generator',
  templateUrl: './image-generator.component.html',
  styleUrl: './image-generator.component.scss'
})
export class ImageGeneratorComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isImageDescriptionVisible: boolean = false;
  isGenerating: boolean = false;
  storeSubscription?: Subscription;
  @Output() imageGenerated: EventEmitter<string | null> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.selectDataFromStore();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      imageDescription: [null, [Validators.required, 
                                Validators.minLength(10),
                                Validators.maxLength(300)]]
    });
  }

  selectDataFromStore() {
    this.storeSubscription = combineLatest({
      generatedImage: this.store.select(projectsSelectors.selectGeneratedImage),
      isGenerating: this.store.select(projectsSelectors.selectIsGeneratingImage)
    }).subscribe(
      dataFromStore => {
        this.imageGenerated.emit(dataFromStore.generatedImage);
        this.isGenerating = dataFromStore.isGenerating;
      }
    )
  }

  showImageDescriptionForm() {
    this.form.reset();
    this.isImageDescriptionVisible = true;
  }

  hideImageDescriptionForm() {
    this.form.setErrors(null);
    this.isImageDescriptionVisible = false;
  }

  generateImage() {
    const formValue = this.form.getRawValue();
    this.store.dispatch(projectsActions.generateImage(formValue));
    this.isImageDescriptionVisible = false;
  }

  ngOnDestroy(): void {
    this.storeSubscription?.unsubscribe();
  }

  get imageDescriptionControl() {
    return this.form.get('imageDescription') as FormControl;
  }
}
